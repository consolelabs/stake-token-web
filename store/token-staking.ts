import { create } from "zustand";
import wretch from "wretch";

export interface Chain {
  id?: number;
  name?: string;
  short_name?: string;
  coin_gecko_id?: string;
  rpc?: string;
  currency?: string;
}

export interface Token {
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_decimal: number;
  token_abi: string;
  token_price?: number;
  token_chain_id?: Chain;
}

export interface Contract {
  contract_abi: string;
  contract_address: string;
  contract_chain: Chain;
}

export type PoolType = "flexible" | "fixed" | "nft";

export interface Pool {
  guild_id?: string;
  staking_token: Token;
  reward_token: Token;
  contract: Contract;
  description?: string;
  type: PoolType;
  rpc?: string;
}

interface State {
  stakingPools: Pool[];
}

interface Action {
  fetchStakingPools: () => Promise<void>;
}

const initialState: State = {
  stakingPools: [],
};

export const useTokenStaking = create<State & Action>((set, get) => ({
  ...initialState,
  fetchStakingPools: async () => {
    const res = await wretch(
      "https://api-preview.tono.console.so/api/v1/guilds/462663954813157376/community/token/staking"
    )
      .get()
      .json((res) => res?.data?.data);
    set({ stakingPools: res || [] });
  },
}));
