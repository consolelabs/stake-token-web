import { create } from "zustand";

interface Chain {
  id?: number;
  name?: string;
  short_name?: string;
  coin_gecko_id?: string;
  rpc?: string;
  currency?: string;
}

interface Token {
  token_address?: string;
  token_name?: string;
  token_symbol?: string;
  token_decimal?: number;
  token_price?: number;
  token_chain_id?: Chain;
}

interface Contract {
  contract_abi?: string;
  contract_address?: string;
  contract_chain?: Chain;
}

interface StakingToken {
  guild_id?: string;
  staking_token?: Token;
  reward_token?: Token;
  contract?: Contract;
  description?: string;
  type?: "flexible" | "fixed" | "nft";
  rpc?: string;
}

interface State {
  stakingTokens: StakingToken[];
}

interface Action {
  fetchStakingTokens: () => Promise<void>;
}

const initialState: State = {
  stakingTokens: [],
};

export const useTokenStaking = create<State & Action>((set, get) => ({
  ...initialState,
  fetchStakingTokens: async () => {
    const response = await fetch(
      "https://api-preview.tono.console.so/api/v1/guilds/462663954813157376/community/token/staking"
    );
    const json = await response.json();
    set({ stakingTokens: json?.data?.data || [] });
  },
}));
