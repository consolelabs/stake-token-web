import { ERC20TokenInteraction, StakingPool } from "@/services";
import { TokenAmount } from "@/utils/number";
import { create } from "zustand";

interface State {
  poolContract: StakingPool | null;
  icyContract: ERC20TokenInteraction | null;
  aprPercentage: number;
  balance: TokenAmount;
  allowance: TokenAmount;
}

interface Action {
  reset: () => void;
  setValues: (values: Partial<State>) => void;
}

const initialState: State = {
  poolContract: null,
  icyContract: null,
  aprPercentage: 0,
  balance: { value: 0, display: "" },
  allowance: { value: 0, display: "" },
};

export const useFlexibleStaking = create<State & Action>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setValues: (values) => set((state) => ({ ...state, ...values })),
}));
