import { ChainProvider } from "@mochi-web3/login-widget";
import { create } from "zustand";
import { useNFTStaking } from "./nft-staking";
import { useFlexibleStaking } from "./flexible-staking";

interface State {
  address: string;
  provider: ChainProvider | null;
}

interface Action {
  setConnectedWallet: (address: string, provider: ChainProvider) => void;
}

const initialState: State = {
  address: "",
  provider: null,
};

export const useConnectedWallet = create<State & Action>((set, get) => ({
  ...initialState,
  setConnectedWallet: (address, provider) => {
    set({ address, provider });
    const initializeNFTContract = useNFTStaking.getState().initializeContract;
    initializeNFTContract(address, provider);
    const initializeFlexibleStakingContract =
      useFlexibleStaking.getState().initializeContract;
    initializeFlexibleStakingContract(address, provider);
  },
}));
