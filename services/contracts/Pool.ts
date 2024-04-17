import { ChainProvider } from "@mochi-web3/login-widget";
import { BigNumber, constants } from "ethers";
import { getAmountWithDecimals } from "@/utils/number";
import { Chain, Token, PoolType, Pool } from "@/store/token-staking";

const getPoolKey = (
  type: PoolType,
  stakingTokenSymbol: string,
  rewardTokenSymbol: string
): string => {
  if (type === "nft") return type;
  return `${type}-${stakingTokenSymbol}-${rewardTokenSymbol}`;
};

export class StakingPool {
  private static instances: Map<string, StakingPool> = new Map();
  private provider: ChainProvider;
  private abi: string;
  private address: string;
  private stakingToken: Token;
  private rewardToken: Token;
  private chain: Chain;
  private description: string;
  private sender: string = "";

  private constructor(
    _abi: string,
    _address: string,
    _stakingToken: Token,
    _rewardToken: Token,
    _chain: Chain,
    _description: string,
    _provider: ChainProvider
  ) {
    this.provider = _provider;
    this.abi = _abi;
    this.address = _address;
    this.stakingToken = _stakingToken;
    this.rewardToken = _rewardToken;
    this.description = _description;
    this.chain = _chain;
  }

  public static getInstance(
    pool: Pool,
    provider: ChainProvider
  ): StakingPool | undefined {
    const { type, reward_token, staking_token, description } = pool;

    const { contract_abi, contract_address, contract_chain } = pool?.contract;

    const poolKey = getPoolKey(
      type,
      staking_token.token_symbol,
      reward_token.token_symbol
    ).toLowerCase();
    if (!StakingPool.instances.has(poolKey)) {
      StakingPool.instances.set(
        poolKey,
        new StakingPool(
          contract_abi,
          contract_address,
          staking_token,
          reward_token,
          contract_chain,
          description || "",
          provider
        )
      );
    }
    return StakingPool.instances.get(poolKey)!;
  }

  setSenderAddress(address: string) {
    this.sender = address;
  }

  getAddress() {
    return this.address;
  }

  async getPeriodFinishDate(): Promise<number> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "periodFinish",
        args: [],
        to: this.address,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        console.log("getPeriodFinishDate", response[0].toNumber());
        return response[0].toNumber();
      }

      console.error("cannot get periodFinish");
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async getPeriodStartDate(): Promise<number> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "lastUpdateTime",
        args: [],
        to: this.address,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        console.log("getLastRewardUpdateDate", response[0].toBigInt());
        return response[0].toNumber();
      }

      console.error("cannot get lastUpdateTime");
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async getRewardDuration(): Promise<number> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "rewardsDuration",
        args: [],
        to: this.address,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        console.log("getRewardDuration", response[0].toNumber());
        return response[0].toNumber();
      }

      console.error("cannot get getRewardDuration");
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async getRewardPerTokenStaked(): Promise<BigNumber | undefined> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "rewardPerToken",
        args: [],
        to: this.address,
      });

      console.log("getRewardPerTokenStaked:", response);
      if (response?.length && BigNumber.isBigNumber(response[0])) {
        return response[0];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getSenderStakedAmount(): Promise<BigNumber | undefined> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "balanceOf",
        args: [this.sender],
        to: this.address,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        return response[0];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getPoolTotalStakedAmount(): Promise<BigNumber | undefined> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "totalSupply",
        args: [],
        to: this.address,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        return response[0];
      }
    } catch (error) {
      console.error(error);
    }
  }

  // total reward earned (claimed + unclaimed)
  async getClaimedRewardsForAddress(): Promise<BigNumber | undefined> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "claimedRewards",
        args: [this.sender],
        to: this.address,
      });
      console.log("getClaimedRewardsForAddress: ", response);
      if (response?.length && BigNumber.isBigNumber(response[0])) {
        return response[0];
      }
    } catch (error) {
      console.error(error);
    }
  }

  // unclaimed reward for address
  async getRewardAvailableForClaim(): Promise<BigNumber | undefined> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "earned",
        args: [this.sender],
        to: this.address,
      });
      console.log("getRewardAvailableForClaim: ", response);
      if (response?.length && BigNumber.isBigNumber(response[0])) {
        return response[0];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getCurrentRewardRate(): Promise<BigNumber | undefined> {
    try {
      const response: BigNumber[] = await this.provider.read({
        abi: this.abi,
        method: "rewardRate",
        args: [],
        to: this.address,
      });
      if (response?.length && BigNumber.isBigNumber(response[0])) {
        return response[0];
      }
    } catch (error) {
      console.error(error);
    }
  }

  // assume you staked 1 token
  async calculateRealtimeAPR(): Promise<BigNumber> {
    const daysInYear = 365;
    const rewardRate = await this.getCurrentRewardRate();
    const rewardDuration = await this.getRewardDuration();
    if (rewardRate && rewardDuration) {
      const estimateAPR = rewardRate.mul(rewardDuration).mul(daysInYear / 7 * 100);
      return estimateAPR;
    }
    return constants.Zero;
  }

  /**
   * WRITE METHODS
   */
  async stake(amount: number): Promise<string | undefined> {
    const { token_decimal } = this.stakingToken;
    const amountWithDecimals = getAmountWithDecimals(amount, token_decimal);
    try {
      const txHash = await this.provider.write({
        abi: this.abi,
        method: "deposit",
        args: [amountWithDecimals],
        to: this.address,
        from: this.sender,
      });
      if (txHash) return txHash;
    } catch (error) {
      console.error(error);
    }
  }

  async unstake(): Promise<string | undefined> {
    try {
      const txHash = await this.provider.write({
        abi: this.abi,
        method: "unstake",
        args: [],
        to: this.address,
        from: this.sender,
      });
      if (txHash) return txHash;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async claimReward(): Promise<string | undefined> {
    try {
      const txHash = await this.provider.write({
        abi: this.abi,
        method: "getReward",
        args: [],
        to: this.address,
        from: this.sender,
      });
      if (txHash) return txHash;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
