import { BigNumber, Contract, constants } from "ethers";
import { create } from "zustand";
import { useFlexibleStaking } from "./flexible-staking";
import { JsonRpcProvider } from "@ethersproject/providers";
import { API } from "@/constants/api";
import { Abi, NftAddress } from "@/services";
import { useNFTStaking } from "./nft-staking";
import wretch from "wretch";
import { useTokenStaking } from "./token-staking";
import { persist } from "zustand/middleware";

export interface Wallet {
  address: string;
  avatar?: string;
  connectionStatus: "connected" | "disconnected" | "not_installed";
  flexibleStaking?: {
    token: string;
    balance: string;
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
    wallets: Pick<Wallet, "address" | "connectionStatus">[]
  ) => Promise<void>;
  getConnectedWallet: () => Wallet | null;
  reset: () => void;
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
    : BigNumber.from(a.flexibleStaking?.balance || "0").gt(
        BigNumber.from(b.flexibleStaking?.balance || "0")
      )
    ? -1
    : BigNumber.from(b.flexibleStaking?.balance || "0").gt(
        BigNumber.from(a.flexibleStaking?.balance || "0")
      )
    ? 1
    : 0;

export const useWalletBalance = create(
  persist<State & Action>(
    (set, get) => ({
      ...defaultState,
      setValues: (values) => set((state) => ({ ...state, ...values })),
      initializeMochiWallet: async (profile) => {
        // flexible mochi balance
        const stakingToken = useTokenStaking
          .getState()
          .stakingPools.find((each) => each.type === "flexible")?.staking_token;
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
              balance: mochiFlexibleStakingBalance.toString(),
              price: stakingToken.token_price || 1,
            },
          },
        });
      },
      initializeWallets: async (wallets) => {
        const isConnected = wallets.some(
          (w) => w.connectionStatus === "connected"
        );
        if (!isConnected && get().walletsWithBalance.length) {
          try {
            const balance = get().walletsWithBalance.find(
              (w) => !BigNumber.from(w.flexibleStaking?.balance || "0").isZero()
            )?.flexibleStaking?.balance;
            if (balance) {
              useFlexibleStaking
                .getState()
                .setValues({ balance: BigNumber.from(balance) });
            }
          } catch (err: any) {}
        }

        // flexible token balances
        const stakingPool = useTokenStaking
          .getState()
          .stakingPools.find((each) => each.type === "flexible");
        const stakingToken = stakingPool?.staking_token;

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
                balance: balances[i].toString(),
                price: stakingToken.token_price || 1,
              },
            }))
            .sort(sortWallets);
          get().setValues({ walletsWithBalance });

          // initialize default balance and staked amount and unclaimed rewards if not connected
          if (isConnected) return;
          const index = balances.findIndex((b) => !b.isZero());
          const defaultAddress = wallets[index]?.address || "";

          // get default values for flexible staking
          const poolContract = new Contract(
            stakingPool.contract.contract_address,
            stakingPool.contract.contract_abi,
            provider
          );
          Promise.all([
            poolContract.balanceOf(defaultAddress),
            poolContract.earned(defaultAddress),
            poolContract.claimedRewards(defaultAddress),
          ])
            .then(([stakedAmount, unclaimedRewards, totalEarnedRewards]) => {
              useFlexibleStaking.getState().setValues({
                balance: balances[index] || constants.Zero,
                stakedAmount: BigNumber.isBigNumber(stakedAmount)
                  ? stakedAmount
                  : constants.Zero,
                unclaimedRewards: BigNumber.isBigNumber(unclaimedRewards)
                  ? unclaimedRewards
                  : constants.Zero,
                totalEarnedRewards: BigNumber.isBigNumber(totalEarnedRewards)
                  ? totalEarnedRewards
                  : constants.Zero,
              });
            })
            .catch(() => {});

          // get default values for nft
          const nftContract = new Contract(NftAddress.NFT, Abi.Nft, provider);
          nftContract
            .totalMaxSupplyOfToken()
            .then((totalTokenSupply: BigNumber) => {
              Promise.all(
                Array.from({ length: Number(totalTokenSupply.toString()) }).map(
                  async (_, i) => ({
                    tokenId: i + 1,
                    owner: await nftContract.ownerOf(i + 1),
                  })
                )
              )
                .then((result) =>
                  result.filter(
                    ({ owner }) =>
                      owner.toString().toLowerCase() ===
                      defaultAddress.toLowerCase()
                  )
                )
                .then((result) => {
                  useNFTStaking.getState().setValues({
                    nftData: result.map(({ tokenId }) => ({ tokenId })),
                  });
                  return result.map(({ tokenId }) => tokenId);
                })
                .then(async (tokenIds) => {
                  Promise.all(
                    tokenIds.map(async (tokenId) => {
                      const uri = await nftContract.tokenURI(tokenId);
                      const { name, image } = await wretch(uri)
                        .get()
                        .json<{ name?: string; image?: string }>();
                      return { tokenId, name, image };
                    })
                  ).then((result) => {
                    useNFTStaking.getState().setValues({
                      nftData: result,
                    });
                  });
                });
            })
            .catch(() => {});
        } catch (err: any) {}
      },
      getConnectedWallet: () =>
        get().walletsWithBalance.find(
          (w) => w.connectionStatus === "connected"
        ) || null,
      reset: () => set(defaultState),
    }),
    {
      name: "wallet-balance",
    }
  )
);
