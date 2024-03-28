import { ethers } from "ethers";
import {
  IcyToken__factory,
  StakingPool,
  StakingPoolFactory__factory,
  StakingPool__factory,
} from "../contracts/types";

export interface PoolInfo {
  stakingPoolAddress: string;
  stakingToken: string;
  rewardToken: string;
  rewardAmount?: number;
  rewardProgressAmount?: number;
  rewardTotalAmount?: number;
}

// TODO: should refactor this
const BASE_PROVIDER_RPC = process.env.BASE_PROVIDER_RPC as string;
const DEPLOYER_WALLET_KEY = process.env.BASE_PROVIDER_RPC as string;
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS as string;
const ICY_TOKEN_ADDRESS = process.env.ICY_TOKEN_ADDRESS as string;

// connect to Base RPC Provider
const provider = new ethers.providers.JsonRpcProvider(BASE_PROVIDER_RPC);
const deployerSigner = new ethers.Wallet(DEPLOYER_WALLET_KEY, provider);

// instantiate StakingPoolFactory contract
const factoryContract = StakingPoolFactory__factory.connect(
  FACTORY_ADDRESS,
  deployerSigner
);

// instantiate StakingPoolFactory contract
const icyToken = IcyToken__factory.connect(
  ICY_TOKEN_ADDRESS,
  deployerSigner
);

export const getPoolContractByAddress = (address: string): StakingPool => {
  const poolContract = StakingPool__factory.connect(address, deployerSigner);
  return poolContract;
}

// TODO: update to sign user's metamask popup instead of using deployerSigner here
export const depositToStakingPool = async (poolAddress: string, amount: number) => {
  const poolContract = StakingPool__factory.connect(poolAddress, deployerSigner);
  const amountWithDecimal = BigInt(amount) * BigInt(1000000000000000000);
  const tx = await poolContract.deposit(amountWithDecimal);
  await tx.wait();
  console.log("Deposit TX success: ", tx.hash);
}

// TODO: implement formula to calculate realtime APR
export const calculateRealtimeAPR = async () => {
  const value = await Promise.resolve(0);
  return value;
}

export const getAllPoolAddresses = async (): Promise<string[]> => {
  const poolKeys = await fetchAllPoolKeys();
  const addresses = await Promise.all(poolKeys.map(async key => {
    const infos = await getPoolInfoByKey(key);
    if (infos?.length) {
      return infos[0];
    }
    return "";
  }));
  return addresses.filter(val => val !== "");
}

const fetchAllPoolKeys = async (): Promise<string[]> => {
  const poolKeys = [];
  let count = 0;
  while (true) {
    try {
      const key = await factoryContract.stakingPoolKeys(count);
      poolKeys.push(key);
      count = count + 1;
    } catch (error) {
      return poolKeys;
    }
  }
};

const getPoolInfoByKey = async (key: string) => {
  try {
    const poolInfo = await factoryContract.stakingPoolInfoByStakingToken(key);
    return poolInfo;
  } catch (error) {
    console.error("failed to fetch pool info: ", error);
    return null;
  }
};


