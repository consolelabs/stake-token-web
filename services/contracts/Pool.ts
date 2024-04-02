import { ChainProvider } from "@mochi-web3/connect-wallet-widget";
import { ERC20TokenInfo } from "..";
import { BigNumberish } from "ethers";

const Abi = {
  POOL_ICY_ICY: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_rewardsDistributor\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_rewardsToken\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_stakingToken\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"target\",\"type\":\"address\"}],\"name\":\"AddressEmptyCode\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"AddressInsufficientBalance\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"EnforcedPause\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ExpectedPause\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"FailedInnerCall\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ReentrancyGuardReentrantCall\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"}],\"name\":\"SafeERC20FailedOperation\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Deposited\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Paused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Recovered\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"reward\",\"type\":\"uint256\"}],\"name\":\"RewardAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"reward\",\"type\":\"uint256\"}],\"name\":\"RewardPaid\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newDuration\",\"type\":\"uint256\"}],\"name\":\"RewardsDurationUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Unpaused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Withdrawn\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"deposit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"earned\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getReward\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getRewardForDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"lastTimeRewardApplicable\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"lastUpdateTime\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reward\",\"type\":\"uint256\"}],\"name\":\"notifyRewardAmount\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"periodFinish\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"tokenAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenAmount\",\"type\":\"uint256\"}],\"name\":\"recoverERC20\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rewardPerToken\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rewardPerTokenStored\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rewardRate\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"rewards\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rewardsDistributor\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rewardsDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rewardsToken\",\"outputs\":[{\"internalType\":\"contract IERC20\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_rewardsDuration\",\"type\":\"uint256\"}],\"name\":\"setRewardsDuration\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakingToken\",\"outputs\":[{\"internalType\":\"contract IERC20\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"unstake\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userRewardPerTokenPaid\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
  POOL_ICY_DFG: "",
}

export const PoolAddress = {
  POOL_ICY_ICY: "0x92598F02cE6D26Fa320d3fDE73f4EE1059448d66",
  POOL_ICY_DFG: "",
}

export type PoolType = "ICY_ICY" | "ICY_DFG";

interface TokenInfo {
  address: string;
  decimals: number;
}

export class StakingPool {
  private static instances: Map<string, StakingPool> = new Map();
  private provider: ChainProvider;
  private abi: string;
  private address: string;
  private stakingToken: TokenInfo;
  private rewardToken: TokenInfo;
  private sender: string = "";

  private constructor(_abi: string, _address: string, _stakingToken: TokenInfo, _rewardToken: TokenInfo, _provider: ChainProvider) {
    this.provider = _provider;
    this.abi = _abi;
    this.address = _address;
    this.stakingToken = _stakingToken;
    this.rewardToken = _rewardToken;
  }

  public static getInstance(type: PoolType, _provider: ChainProvider): StakingPool {
    if (!StakingPool.instances.has(type)) {
      if (type === "ICY_ICY") {
        StakingPool.instances.set(type, new StakingPool(Abi.POOL_ICY_ICY, PoolAddress.POOL_ICY_ICY, ERC20TokenInfo.ICY, ERC20TokenInfo.ICY, _provider));
      } else {
        StakingPool.instances.set(type, new StakingPool(Abi.POOL_ICY_DFG, PoolAddress.POOL_ICY_DFG, ERC20TokenInfo.ICY, ERC20TokenInfo.DFG, _provider));
      }
    }
    return StakingPool.instances.get(type)!;
  }

  setSenderAddress(address: string) {
    this.sender = address;
  }

  getAddress() {
    return this.address;
  }

  // rewardDuration, lastUpdateTime, periodFinishTime
  async getStakingPeriodMetadata() {
    await this.getLastRewardUpdateDate();
    await this.getPeriodFinishDate();
  }

  async getPeriodFinishDate() {
    try {
      const response: BigNumberish[] = await this.provider.read({ 
        abi: this.abi, 
        method: "periodFinish", 
        args: [],
        to: this.address,
        from: this.sender,
      });
      // if (!response?.length) return;
      console.log("getPeriodFinishDate", response);
      // return this.getBigNumberValueByDecimals(response[0]);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getLastRewardUpdateDate() {
    try {
      const response: BigNumberish[] = await this.provider.read({ 
        abi: this.abi, 
        method: "lastUpdateTime", 
        args: [],
        to: this.address,
        from: this.sender,
      });
      // if (!response?.length) return;
      console.log("getLastRewardUpdateDate", response);
      // return this.getBigNumberValueByDecimals(response[0]);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getRewardPerTokenStaked() {
    try {
      const response: BigNumberish[] = await this.provider.read({ 
        abi: this.abi, 
        method: "rewardPerToken", 
        args: [],
        to: this.address,
        from: this.sender,
      });
      // if (!response?.length) return;
      console.log(response);
      // return this.getBigNumberValueByDecimals(response[0]);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getSenderStakedAmount() {
    try {
      const response: BigNumberish[] = await this.provider.read({ 
        abi: this.abi, 
        method: "balanceOf", 
        args: [this.sender],
        to: this.address,
        from: this.sender,
      });
      // if (!response?.length) return;
      console.log(response);
      // return this.getBigNumberValueByDecimals(response[0]);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getPoolTotalStakedAmount() {
    try {
      const response: BigNumberish[] = await this.provider.read({ 
        abi: this.abi, 
        method: "totalSupply", 
        args: [],
        to: this.address,
        from: this.sender,
      });
      // if (!response?.length) return;
      console.log(response);
      // return this.getBigNumberValueByDecimals(response[0]);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getTotalRewardEarnedForAddress() {
    try {
      const response: BigNumberish[] = await this.provider.read({ 
        abi: this.abi, 
        method: "earned", 
        args: [this.sender],
        to: this.address,
        from: this.sender,
      });
      // if (!response?.length) return;
      console.log(response);
      // return this.getBigNumberValueByDecimals(response[0]);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getCurrentRewardRate() {
    try {
      const response: BigNumberish[] = await this.provider.read({ 
        abi: this.abi, 
        method: "rewardRate", 
        args: [],
        to: this.address,
        from: this.sender,
      });
      // if (!response?.length) return;
      console.log(response);
      // return this.getBigNumberValueByDecimals(response[0]);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  /**
   * WRITE METHODS
   */
  async stake(amount: number) {
    const { decimals } = this.stakingToken;
    const amountWithDecimals = BigInt(amount) * BigInt(10**decimals);
    try {
      const txHash = await this.provider.write({ 
        abi: this.abi, 
        method: "deposit", 
        args: [amountWithDecimals.toString().replace("n", "")],
        to: this.address,
        from: this.sender,
      });
      if (txHash) return txHash;
      console.log("stake tx_hash = ", txHash);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async unstake() {
    try {
      const txHash = await this.provider.write({ 
        abi: this.abi, 
        method: "unstake", 
        args: [],
        to: this.address,
        from: this.sender,
      });
      if (txHash) return txHash;
      console.log("unstake tx_hash = ", txHash);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async claimReward() {
    try {
      const txHash = await this.provider.write({ 
        abi: this.abi, 
        method: "getReward",
        args: [],
        to: this.address,
        from: this.sender,
      });
      if (txHash) return txHash;
      console.log("getReward tx_hash = ", txHash);
    } catch (error) {
      console.error(error);
      return;
    }
  }
}