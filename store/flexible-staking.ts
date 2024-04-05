import { ERC20TokenInteraction, StakingPool } from "@/services";
import { ChainProvider } from "@mochi-web3/login-widget";
import { create } from "zustand";
import { useTokenStaking } from "./token-staking";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import { formatUnits } from "ethers/lib/utils";

interface State {
  address: string;
  provider: ChainProvider | null;
  poolContract: StakingPool | null;
  icyContract: ERC20TokenInteraction | null;
  apr: number;
  balance: number;
  allowance: number;
  stakedAmount: number;
  poolStakedAmount: number;
  unclaimedRewards: number;
  totalEarnedRewards: number;
  nftBoost: number;
  tokenPrice: number;
  startTime: number; // in seconds
  finishTime: number; // in seconds
  autoStaking: boolean;
  latestStaking: {
    txHash: string;
    amount: number;
  } | null;
}

interface Action {
  reset: () => void;
  setValues: (values: Partial<State>) => void;
  updateValues: () => Promise<void>;
  initializeContract: (address: string, provider: ChainProvider) => void;
  initializeValues: () => Promise<void>;
}

const initialState: State = {
  address: "",
  provider: null,
  poolContract: null,
  icyContract: null,
  apr: 0,
  balance: 0,
  allowance: 0,
  stakedAmount: 0,
  poolStakedAmount: 0,
  unclaimedRewards: 0,
  totalEarnedRewards: 0,
  nftBoost: 0,
  tokenPrice: 0,
  startTime: 0,
  finishTime: 0,
  autoStaking: true,
  latestStaking: null,
};

export const useFlexibleStaking = create<State & Action>((set, get) => ({
  ...initialState,
  reset: () => {
    const { apr, poolStakedAmount, tokenPrice, ...resetValues } = initialState;
    set(resetValues);
  },
  setValues: (values) => set((state) => ({ ...state, ...values })),
  initializeValues: async () => {
    const stakingToken = useTokenStaking
      .getState()
      .stakingTokens.find((each) => each.type === "flexible");
    if (!stakingToken) return;

    try {
      const provider = new JsonRpcProvider(stakingToken.rpc);
      const contract = new Contract(
        stakingToken.contract?.contract_address || "",
        stakingToken.contract?.contract_abi || "",
        provider
      );

      const results = await Promise.allSettled([
        contract.rewardRate(),
        contract.rewardsDuration(),
        contract.totalSupply(),
      ]);
      const [rewardRateRes, rewardDurationRes, totalSupplyRes] = results.map(
        (r) => (r.status === "fulfilled" ? r.value : null)
      );

      // get apr
      const daysInYear = 365;
      const rewardRate = BigNumber.isBigNumber(rewardRateRes)
        ? Number(
            formatUnits(
              rewardRateRes.toBigInt(),
              stakingToken.staking_token?.token_decimal
            )
          )
        : 0;
      const rewardDuration = BigNumber.isBigNumber(rewardDurationRes)
        ? rewardDurationRes.toNumber()
        : 0;
      const apr =
        rewardRate && rewardDuration
          ? Math.trunc(rewardRate * rewardDuration * daysInYear * 100)
          : 0;

      //get pool staked amount
      const poolStakedAmount = BigNumber.isBigNumber(totalSupplyRes)
        ? Number(
            formatUnits(
              totalSupplyRes.toBigInt(),
              stakingToken.staking_token?.token_decimal
            )
          )
        : 0;

      get().setValues({
        apr,
        poolStakedAmount,
        tokenPrice: stakingToken.staking_token?.token_price || 0,
      });
    } catch (err: any) {}
  },
  initializeContract: (address, provider) => {
    const poolContract = StakingPool.getInstance("ICY_ICY", provider);
    const icyContract = ERC20TokenInteraction.getInstance("ICY", provider);
    poolContract.setSenderAddress(address);
    icyContract.setSenderAddress(address);
    get().setValues({ address, provider, poolContract, icyContract });
  },
  updateValues: async () => {
    const stakingToken = useTokenStaking.getState().stakingTokens[0];
    const { icyContract, poolContract } = get();
    if (!icyContract || !poolContract || !stakingToken) return;

    const [
      getBalance,
      getAllowance,
      getApr,
      getStakedAmount,
      getPoolStakedAmount,
      getUnclaimedRewards,
      getTotalEarnedRewards,
      getStartDate,
      getFinishDate,
    ] = await Promise.allSettled([
      icyContract.getTokenBalance(),
      icyContract.getAllowance(stakingToken.contract?.contract_address || ""),
      poolContract.calculateRealtimeAPR(),
      poolContract.getSenderStakedAmount(),
      poolContract.getPoolTotalStakedAmount(),
      poolContract.getRewardAvailableForClaim(),
      poolContract.getTotalRewardEarnedForAddress(),
      poolContract.getPeriodStartDate(),
      poolContract.getPeriodFinishDate(),
    ]);
    const apr = getApr.status === "fulfilled" ? getApr.value || 0 : 0;
    const balance =
      getBalance.status === "fulfilled" ? getBalance.value?.value || 0 : 0;
    const allowance =
      getAllowance.status === "fulfilled" ? getAllowance.value?.value || 0 : 0;
    const stakedAmount =
      getStakedAmount.status === "fulfilled"
        ? getStakedAmount.value?.value || 0
        : 0;
    const poolStakedAmount =
      getPoolStakedAmount.status === "fulfilled"
        ? getPoolStakedAmount.value?.value || 0
        : 0;
    const unclaimedRewards =
      getUnclaimedRewards.status === "fulfilled"
        ? getUnclaimedRewards.value?.value || 0
        : 0;
    const totalEarnedRewards =
      getTotalEarnedRewards.status === "fulfilled"
        ? getTotalEarnedRewards.value?.value || 0
        : 0;
    const startTime =
      getStartDate.status === "fulfilled" ? getStartDate.value : 0;
    const finishTime =
      getFinishDate.status === "fulfilled" ? getFinishDate.value : 0;
    set((state) => ({
      ...state,
      apr,
      balance,
      allowance,
      stakedAmount,
      poolStakedAmount,
      unclaimedRewards,
      totalEarnedRewards,
      startTime,
      finishTime,
    }));
  },
}));
