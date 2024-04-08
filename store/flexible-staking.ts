import { ERC20TokenInteraction, StakingPool } from "@/services";
import { ChainProvider } from "@mochi-web3/login-widget";
import { create } from "zustand";
import { useTokenStaking } from "./token-staking";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, Contract, constants } from "ethers";
import { parseUnits } from "ethers/lib/utils";

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
  tokenPrice: BigNumber;
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
  tokenPrice: constants.Zero,
  startTime: 0,
  finishTime: 0,
  autoStaking: true,
  latestStaking: null,
};

const getStakingPool = () =>
  useTokenStaking
    .getState()
    .stakingPools.find((each) => each.type === "flexible");

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
      .stakingPools.find((each) => each.type === "flexible");
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
        ? rewardRateRes
        : constants.Zero;
      const rewardDuration = BigNumber.isBigNumber(rewardDurationRes)
        ? rewardDurationRes
        : constants.Zero;
      const apr = rewardRate.mul(rewardDuration).mul(daysInYear * 100);

      //get pool staked amount
      const poolStakedAmount = BigNumber.isBigNumber(totalSupplyRes)
        ? totalSupplyRes
        : constants.Zero;

      get().setValues({
        apr,
        poolStakedAmount,
        tokenPrice: stakingToken.staking_token?.token_price
          ? parseUnits(stakingToken.staking_token.token_price.toString())
          : constants.Zero,
      });
    } catch (err: any) {}
  },
  initializeContract: (address, provider) => {
    const pool = getStakingPool();
    if (!pool || !pool?.contract || !pool?.staking_token) {
      return;
    }
    const poolContract = StakingPool.getInstance(pool, provider);
    const stakingTokenContract = ERC20TokenInteraction.getInstance(
      pool?.staking_token,
      provider
    );
    if (!poolContract || !stakingTokenContract) return;
    poolContract.setSenderAddress(address);
    stakingTokenContract.setSenderAddress(address);
    get().setValues({ address, provider, poolContract, stakingTokenContract });
  },
  updateValues: async () => {
    const stakingToken = useTokenStaking.getState().stakingPools[0];
    const { stakingTokenContract, poolContract } = get();
    if (!stakingTokenContract || !poolContract || !stakingToken) return;

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
      stakingTokenContract.getTokenBalance(),
      stakingTokenContract.getAllowance(
        stakingToken.contract?.contract_address || ""
      ),
      poolContract.calculateRealtimeAPR(),
      poolContract.getSenderStakedAmount(),
      poolContract.getPoolTotalStakedAmount(),
      poolContract.getRewardAvailableForClaim(),
      poolContract.getTotalRewardEarnedForAddress(),
      poolContract.getPeriodStartDate(),
      poolContract.getPeriodFinishDate(),
    ]);
    const apr =
      getApr.status === "fulfilled"
        ? getApr.value || constants.Zero
        : constants.Zero;
    const balance =
      getBalance.status === "fulfilled"
        ? getBalance.value || constants.Zero
        : constants.Zero;
    const allowance =
      getAllowance.status === "fulfilled"
        ? getAllowance.value || constants.Zero
        : constants.Zero;
    const stakedAmount =
      getStakedAmount.status === "fulfilled"
        ? getStakedAmount.value || constants.Zero
        : constants.Zero;
    const poolStakedAmount =
      getPoolStakedAmount.status === "fulfilled"
        ? getPoolStakedAmount.value || constants.Zero
        : constants.Zero;
    const unclaimedRewards =
      getUnclaimedRewards.status === "fulfilled"
        ? getUnclaimedRewards.value || constants.Zero
        : constants.Zero;
    const totalEarnedRewards =
      getTotalEarnedRewards.status === "fulfilled"
        ? getTotalEarnedRewards.value || constants.Zero
        : constants.Zero;
    const startTime =
      getStartDate.status === "fulfilled" ? getStartDate.value : 0;
    const finishTime =
      getFinishDate.status === "fulfilled" ? getFinishDate.value : 0;
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
