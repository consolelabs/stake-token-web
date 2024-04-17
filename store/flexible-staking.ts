import { ERC20TokenInteraction, StakingPool } from "@/services";
import { ChainProvider } from "@mochi-web3/login-widget";
import { create } from "zustand";
import { Pool, Token, useTokenStaking } from "./token-staking";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, Contract, constants } from "ethers";

interface State {
  address: string;
  provider: ChainProvider | null;
  poolContract: StakingPool | null;
  stakingTokenContract: ERC20TokenInteraction | null;
  apr: BigNumber;
  balance: BigNumber;
  allowance: BigNumber;
  stakedAmount: BigNumber;
  poolStakedAmount: BigNumber;
  unclaimedRewards: BigNumber;
  totalEarnedRewards: BigNumber;
  nftBoost: BigNumber;
  stakingPool: Pick<
    Pool,
    "description" | "guild_id" | "rpc" | "contract"
  > | null;
  stakingToken: Token | null;
  rewardToken: Token | null;
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
  stakingTokenContract: null,
  apr: constants.Zero,
  balance: constants.Zero,
  allowance: constants.Zero,
  stakedAmount: constants.Zero,
  poolStakedAmount: constants.Zero,
  unclaimedRewards: constants.Zero,
  totalEarnedRewards: constants.Zero,
  nftBoost: constants.Zero,
  stakingPool: null,
  stakingToken: null,
  rewardToken: null,
  startTime: 0,
  finishTime: 0,
  autoStaking: true,
  latestStaking: null,
};

export const useFlexibleStaking = create<State & Action>((set, get) => ({
  ...initialState,
  reset: () => {
    const {
      apr,
      poolStakedAmount,
      stakingPool,
      stakingToken,
      rewardToken,
      ...resetValues
    } = initialState;
    set(resetValues);
  },
  setValues: (values) => set((state) => ({ ...state, ...values })),
  initializeValues: async () => {
    const stakingPool = useTokenStaking
      .getState()
      .stakingPools.find((each) => each.type === "flexible");
    if (!stakingPool) return;

    const { staking_token, reward_token, ...rest } = stakingPool;
    get().setValues({
      stakingPool: rest,
      stakingToken: staking_token,
      rewardToken: reward_token,
    });

    try {
      const provider = new JsonRpcProvider(stakingPool.rpc);
      const contract = new Contract(
        stakingPool.contract?.contract_address || "",
        stakingPool.contract?.contract_abi || "",
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
        ? rewardRateRes
        : constants.Zero;
      const rewardDuration = BigNumber.isBigNumber(rewardDurationRes)
        ? rewardDurationRes
        : constants.Zero;
      const apr = rewardRate.mul(rewardDuration).mul((daysInYear / 7) * 100);

      //get pool staked amount
      const poolStakedAmount = BigNumber.isBigNumber(totalSupplyRes)
        ? totalSupplyRes
        : constants.Zero;

      get().setValues({ apr, poolStakedAmount });
    } catch (err: any) {}
  },
  initializeContract: (address, provider) => {
    const { stakingPool, stakingToken, rewardToken } = get();
    if (!stakingPool || !stakingToken || !rewardToken) {
      return;
    }
    const poolContract = StakingPool.getInstance(
      {
        ...stakingPool,
        staking_token: stakingToken,
        reward_token: rewardToken,
        type: "flexible",
      },
      provider
    );
    const stakingTokenContract = ERC20TokenInteraction.getInstance(
      stakingToken,
      provider
    );
    if (!poolContract || !stakingTokenContract) return;
    poolContract.setSenderAddress(address);
    stakingTokenContract.setSenderAddress(address);
    get().setValues({ address, provider, poolContract, stakingTokenContract });
  },
  updateValues: async () => {
    const { stakingTokenContract, poolContract, stakingPool } = get();
    if (!stakingTokenContract || !poolContract || !stakingPool) return;

    const [
      getBalance,
      getAllowance,
      getApr,
      getStakedAmount,
      getPoolStakedAmount,
      getUnclaimedRewards,
      getClaimedRewards,
      getStartDate,
      getFinishDate,
    ] = await Promise.allSettled([
      stakingTokenContract.getTokenBalance(),
      stakingTokenContract.getAllowance(
        stakingPool.contract?.contract_address || ""
      ),
      poolContract.calculateRealtimeAPR(),
      poolContract.getSenderStakedAmount(),
      poolContract.getPoolTotalStakedAmount(),
      poolContract.getRewardAvailableForClaim(),
      poolContract.getClaimedRewardsForAddress(),
      poolContract.getPeriodStartDate(),
      poolContract.getPeriodFinishDate(),
    ]);
    const [
      balance,
      allowance,
      apr,
      stakedAmount,
      poolStakedAmount,
      unclaimedRewards,
      totalEarnedRewards,
    ] = [
      getBalance,
      getAllowance,
      getApr,
      getStakedAmount,
      getPoolStakedAmount,
      getUnclaimedRewards,
      getClaimedRewards,
    ].map((r) =>
      r.status === "fulfilled" ? r.value || constants.Zero : constants.Zero
    );
    const [startTime, finishTime] = [getStartDate, getFinishDate].map((r) =>
      r.status === "fulfilled" ? r.value || 0 : 0
    );
    get().setValues({
      apr,
      balance,
      allowance,
      stakedAmount,
      poolStakedAmount,
      unclaimedRewards,
      totalEarnedRewards,
      startTime,
      finishTime,
    });
  },
}));
