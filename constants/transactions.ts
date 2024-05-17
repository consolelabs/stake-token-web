import { TransactionActionType } from "@/store/transactions";
import { SVGProps } from "react";
import {
  ArrowUpSquareSolid,
  ArrowDownSquareSolid,
  TipSolid,
  DollarBubbleSolid,
  AirdropCircleSolid,
} from "@mochi-ui/icons";

export const transactionActionAppearance: Record<
  TransactionActionType,
  string
> = {
  transfer: "success",
  vault_transfer: "neutral",
  airdrop: "warning",
  stake: "primary",
  unstake: "secondary",
};

export const transactionActionIcon: Record<
  TransactionActionType,
  (p: SVGProps<SVGSVGElement>) => JSX.Element
> = {
  transfer: TipSolid,
  vault_transfer: TipSolid,
  airdrop: AirdropCircleSolid,
  stake: DollarBubbleSolid,
  unstake: DollarBubbleSolid,
};

export const transactionActionColor: Record<TransactionActionType, string> = {
  transfer: "border-success-outline-border",
  vault_transfer: "border-neutral-outline-border",
  airdrop: "border-warning-outline-border",
  stake: "border-primary-outline-border",
  unstake: "border-secondary-outline-border",
};

export const transactionActionString: Record<TransactionActionType, string> = {
  transfer: "Tip",
  vault_transfer: "Vault",
  airdrop: "Airdrop",
  stake: "Stake",
  unstake: "Unstake",
};
