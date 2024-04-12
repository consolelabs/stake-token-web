import { BigNumber, Contract, constants } from "ethers";
import { create } from "zustand";
import { useFlexibleStaking } from "./flexible-staking";
import { JsonRpcProvider } from "@ethersproject/providers";
import { API } from "@/constants/api";

export interface Wallet {
  address: string;
  avatar?: string;
  connectionStatus: "connected" | "disconnected" | "not_installed";
  flexibleStaking?: {
    token: string;
    balance: BigNumber;
    price: number;
  };
}

interface State {
  walletsWithBalance: Wallet[];
  mochiWallet: Wallet | null;
}

interface Action {
  setValues: (values: Partial<State>) => void;
  initializeMochiWallet: (profile: {
    id?: string;
    name?: string;
    avatar?: string;
  }) => Promise<void>;
  initializeWallets: (
    wallets: Omit<Wallet, "stakingBalance">[]
  ) => Promise<void>;
  getConnectedWallet: () => Wallet | null;
}

const defaultState: State = {
  walletsWithBalance: [],
  mochiWallet: null,
};

const sortWallets = (a: Wallet, b: Wallet) =>
  a.connectionStatus === "connected"
    ? -1
    : b.connectionStatus === "connected"
    ? 1
    : a.flexibleStaking?.balance.gt(
        b.flexibleStaking?.balance || constants.Zero
      )
    ? -1
    : b.flexibleStaking?.balance.gt(
        a.flexibleStaking?.balance || constants.Zero
      )
    ? 1
    : 0;

export const useWalletBalance = create<State & Action>((set, get) => ({
  ...defaultState,
  setValues: (values) => set((state) => ({ ...state, ...values })),
  initializeMochiWallet: async (profile) => {
    const { stakingToken } = useFlexibleStaking.getState();
    if (!stakingToken || !profile.id) return;

    const mochiWallet = await API.MOCHI_PAY.get(
      `/mochi-wallet/${profile.id}/balances`
    )
      .json((res) => res.data)
      .catch(() => {});
    const mochiFlexibleStakingToken = mochiWallet.find(
      (each: any) =>
        each.token?.address?.toLowerCase() ===
        stakingToken.token_address.toLowerCase()
    );
    if (!mochiFlexibleStakingToken) return;

    const mochiFlexibleStakingBalance = BigNumber.from(
      String(mochiFlexibleStakingToken?.amount || 0)
    );
    get().setValues({
      mochiWallet: {
        address: `${profile.name} (Mochi)`,
        avatar: profile.avatar,
        connectionStatus: "disconnected",
        flexibleStaking: {
          token: stakingToken.token_symbol,
          balance: mochiFlexibleStakingBalance,
          price: stakingToken.token_price || 1,
        },
      },
    });
  },
  initializeWallets: async (wallets) => {
    if (!get().walletsWithBalance.length) {
      get().setValues({
        walletsWithBalance: wallets.sort(sortWallets),
      });
    }

    const { stakingPool, stakingToken, setValues } =
      useFlexibleStaking.getState();
    if (!stakingPool || !stakingToken) return;

    if (!wallets.length) return;
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
          flexibleStaking: {
            token: stakingToken.token_symbol,
            balance: balances[i],
            price: stakingToken.token_price || 1,
          },
        }))
        .sort(sortWallets);
      get().setValues({ walletsWithBalance });

      // initialize default balance and staked amount and unclaimed rewards if not connected
      const isConnected = wallets.some(
        (w) => w.connectionStatus === "connected"
      );
      if (isConnected) return;
      const index = balances.findIndex((b) => !b.isZero());
      const defaultAddress = wallets[index]?.address || "";
      const poolContract = new Contract(
        stakingPool.contract.contract_address,
        stakingPool.contract.contract_abi,
        provider
      );
      const [getStakedAmount, getUnclaimedRewards] = await Promise.allSettled([
        poolContract.balanceOf(defaultAddress),
        poolContract.rewards(defaultAddress),
      ]);
      setValues({
        balance: balances[index] || constants.Zero,
        stakedAmount:
          getStakedAmount.status === "fulfilled"
            ? getStakedAmount.value
            : constants.Zero,
        unclaimedRewards:
          getUnclaimedRewards.status === "fulfilled"
            ? getUnclaimedRewards.value
            : constants.Zero,
      });
    } catch (err: any) {}
  },
  getConnectedWallet: () =>
    get().walletsWithBalance.find((w) => w.connectionStatus === "connected") ||
    null,
}));
