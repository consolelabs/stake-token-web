import { utils } from "@consolelabs/mochi-formatter";

export type TokenAmount = {
  value: number;
  display: string;
};

export const MAX_AMOUNT_PRECISION = 8;

export function formatTokenAmount(amount: string | number): TokenAmount {
  const roundedAmount = utils.formatDigit({
    value: amount,
    fractionDigits: MAX_AMOUNT_PRECISION,
  });
  const formatNumber = Number(roundedAmount.replaceAll(",", ""));
  return {
    value: formatNumber,
    display: roundedAmount,
  };
}
