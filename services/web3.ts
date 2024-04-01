import { ethers } from "ethers";
import {
  IcyToken,
  IcyToken__factory,
  StakingPool,
  StakingPool__factory,
} from "../contracts/types";

const {
  NEXT_PUBLIC_BASE_PROVIDER_RPC,
  NEXT_PUBLIC_DEPLOYER_WALLET_KEY,
  NEXT_PUBLIC_ICY_TOKEN_ADDRESS,
  NEXT_PUBLIC_FACTORY_ADDRESS,
  NEXT_PUBLIC_POOL_ICY_ICY_ADDRESS,
} = process.env;

export const ContractAddress = {
  PoolIcyIcy: NEXT_PUBLIC_POOL_ICY_ICY_ADDRESS || "",
  PoolFactory: NEXT_PUBLIC_FACTORY_ADDRESS || "",
  IcyToken: NEXT_PUBLIC_ICY_TOKEN_ADDRESS || "",
};

// connect to Base RPC Provider
let userSigner: ethers.Wallet;
let icyTokenContract: IcyToken;
const provider = new ethers.providers.JsonRpcProvider(
  NEXT_PUBLIC_BASE_PROVIDER_RPC as string
);
// const deployerSigner = new ethers.Wallet(NEXT_PUBLIC_DEPLOYER_WALLET_KEY as string, provider);

export const setUserSigner = (signer: ethers.Wallet) => {
  userSigner = signer;
};

const initializeIcyTokenContract = () => {
  if (!userSigner) {
    return;
  }
  icyTokenContract = IcyToken__factory.connect(
    ContractAddress.IcyToken,
    userSigner
  );
};

export const getStakingPoolByAddress = (address: string): StakingPool => {
  const poolContract = StakingPool__factory.connect(address, userSigner);
  return poolContract;
};

export const approvePoolAllowance = async (
  poolAddress: string,
  amount: number
) => {
  try {
    const IcyToken = IcyToken__factory.connect(
      ContractAddress.IcyToken,
      userSigner
    );
    const tx: ethers.ContractTransaction = await IcyToken.approve(
      poolAddress,
      amount
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error(error);
  }
};

// TODO: update to sign user's metamask popup instead of using deployerSigner here
export const depositToStakingPool = async (
  poolAddress: string,
  amount: number,
  userSigner: ethers.Wallet
) => {
  if (userSigner) {
    throw Error("Must connect EVM wallet first"); // should handle error properly at UI component
  }
  try {
    const poolContract = StakingPool__factory.connect(poolAddress, userSigner);
    const amountWithDecimal = BigInt(amount) * BigInt(1000000000000000000);
    const tx = await poolContract.deposit(amountWithDecimal);
    await tx.wait();
    console.log("Deposit TX success: ", tx.hash);
  } catch (error) {
    console.error("Failed to deposit with error: ", error);
    throw error;
  }
};

// TODO: mock
export const getAvailableStakingTokenBalance = async (_poolAddress: string) => {
  if (!icyTokenContract) {
    initializeIcyTokenContract();
  }
  const value = await Promise.resolve(23667);
  return value;
};

// TODO: implement formula to calculate realtime APR
export const calculateRealtimeAPR = async () => {
  const value = await Promise.resolve(0);
  return value;
};
