import { BigNumber, Contract, constants } from "ethers";
import { create } from "zustand";
import { useFlexibleStaking } from "./flexible-staking";
import { JsonRpcProvider } from "@ethersproject/providers";
import { parseUnits } from "ethers/lib/utils";

export interface Wallet {
  address: string;
  connectionStatus: "connected" | "disconnected" | "not_installed";
  balance?: BigNumber;
}

interface State {
  walletsWithBalance: Wallet[];
}

interface Action {
  initializeWallets: (wallets: Omit<Wallet, "balance">[]) => Promise<void>;
  getConnectedWallet: () => Wallet | null;
}

const defaultState: State = {
  walletsWithBalance: [],
};

const sortWallets = (a: Wallet, b: Wallet) =>
  a.connectionStatus === "connected"
    ? -1
    : b.connectionStatus === "connected"
    ? 1
    : 0;

export const useWallet = create<State & Action>((set, get) => ({
  ...defaultState,
  initializeWallets: async (wallets) => {
    if (!get().walletsWithBalance.length) {
      set({
        walletsWithBalance: wallets.sort(sortWallets),
      });
    }

    const { stakingPool, stakingToken, balance, setValues } =
      useFlexibleStaking.getState();
    if (!stakingPool || !stakingToken) return;

    try {
      const provider = new JsonRpcProvider(stakingPool.rpc);
      const contract = new Contract(
        stakingToken.token_address,
        stakingToken.token_abi,
        provider
      );
      const results = await Promise.allSettled(
        wallets.map((w) => contract.balanceOf(w.address))
      );
      const balances = results.map((r) =>
        r.status === "fulfilled"
          ? BigNumber.isBigNumber(r.value)
            ? r.value
            : constants.Zero
          : constants.Zero
      );
      const walletsWithBalance = wallets
        .map((w, i) => ({
          ...w,
          balance: balances[i]
            .mul(parseUnits(String(stakingToken.token_price || 1)))
            .div(parseUnits("1")),
        }))
        .sort(sortWallets);
      set({ walletsWithBalance });

      if (balance.isZero()) {
        setValues({
          balance: balances.find((b) => !b.isZero()) || constants.Zero,
        });
      }
    } catch (err: any) {}
  },
  getConnectedWallet: () =>
    get().walletsWithBalance.find((w) => w.connectionStatus === "connected") ||
    null,
}));
