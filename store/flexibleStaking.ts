import { ERC20TokenInteraction, StakingPool } from "@/services";
import { create } from "zustand";

interface State {
  poolContract: StakingPool | null;
  icyContract: ERC20TokenInteraction | null;
  apr: number;
  balance: number;
  balanceInUsd: number;
  allowance: number;
  stakedAmount: number;
  poolStakedAmount: number;
  earnedRewards: number;
  tokenPrice: number;
  stakeDate: string;
  startTime: string;
  finishTime: string;
  autoStaking: boolean;
}

interface Action {
  reset: () => void;
  setValues: (values: Partial<State>) => void;
}

const initialState: State = {
  poolContract: null,
  icyContract: null,
  apr: 0,
  balance: 0,
  balanceInUsd: 0,
  allowance: 0,
  stakedAmount: 0,
  poolStakedAmount: 0,
  earnedRewards: 0,
  tokenPrice: 1.5,
  stakeDate: "",
  startTime: "",
  finishTime: "",
  autoStaking: true,
};

export const useFlexibleStaking = create<State & Action>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setValues: (values) => set((state) => ({ ...state, ...values })),
}));
