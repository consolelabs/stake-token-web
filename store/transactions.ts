import { SVGProps } from "react";
import { create } from "zustand";

export type TransactionActionType =
  | "transfer"
  | "vault_transfer"
  | "airdrop"
  | "stake"
  | "unstake";

export type TransactionStatus =
  | "submitted"
  | "failed"
  | "pending"
  | "success"
  | "expired";

export interface TransactionFilter {
  sort_by?: string;
  actions?: TransactionActionType[];
}

interface TransactionPagination {
  total: number;
  page: number;
  size: number;
}

export interface Transaction {
  code: string;
  paycode: string;
  siblingTxs: Transaction[];
  where: {
    text: string;
    avatar: string | ((...props: any[]) => JSX.Element);
  };
  from: {
    address: string;
    avatar: string;
    platform?: string;
    platformIcon?: string | ((props: SVGProps<SVGSVGElement>) => JSX.Element);
  };
  to: {
    address: string;
    avatar: string;
    platform?: null | string;
    platformIcon?: string | ((props: SVGProps<SVGSVGElement>) => JSX.Element);
  };
  token: Token;
  action: TransactionActionType;
  singleAmount: string;
  singleAmountUsd: string;
  amount: string;
  amountUsd: string;
  date: string;
  full_date: string;
  rawDate: string;
  status: TransactionStatus;
  isNew?: boolean;
  originalTxId?: string;
  metadata?: any;
}

export interface Token {
  id: number;
  address?: string;
  symbol?: string;
  chain_id?: number;
  decimal?: number;
  discord_bot_supported?: boolean;
  coin_gecko_id?: string;
  name?: string;
  guild_default?: boolean;
  is_native?: boolean;
  price?: number;
  chain?: {
    id?: number;
    name?: string;
    short_name?: string;
    coin_gecko_id?: string;
    rpc?: string;
    currency?: string;
    is_evm?: boolean;
    explorer?: string;
  };
  icon?: string;
}

interface Data {
  pagination: TransactionPagination;
  transactions?: Transaction[];
  token?: Token;
}

interface State extends Data {
  filters: TransactionFilter;
  isLoading: boolean;
}

interface Action {
  setValues: (values: Partial<State>) => void;
  setFilters: (filters: Partial<TransactionFilter>) => void;
  setPagination: (pagination: Partial<TransactionPagination>) => void;
}

const initialState: State = {
  pagination: {
    total: 0,
    page: 0,
    size: 15,
  },
  filters: {},
  transactions: [],
  isLoading: false,
};

export const useTransactions = create<State & Action>((set, get) => ({
  ...initialState,
  setValues: (values) => set((state) => ({ ...state, ...values })),
  setFilters: (filters) => {
    if (get().isLoading) return;
    const isDifferent = Object.keys(filters).some(
      (key) =>
        filters[key as keyof typeof filters] !==
        get().filters[key as keyof TransactionFilter]
    );
    if (!isDifferent) return;
    set((state) => {
      return {
        ...state,
        filters: { ...state.filters, ...filters },
        pagination: { ...state.pagination, page: 0 },
      };
    });
  },
  setPagination: (pagination) => {
    if (get().isLoading) return;
    const isDifferent = Object.keys(pagination).some(
      (key) =>
        pagination[key as keyof typeof pagination] !==
        get().pagination[key as keyof TransactionPagination]
    );
    if (!isDifferent) return;
    set((state) => {
      return {
        ...state,
        pagination: { ...state.pagination, ...pagination },
      };
    });
  },
}));
