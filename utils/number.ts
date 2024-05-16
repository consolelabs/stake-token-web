import { utils } from "@consolelabs/mochi-formatter";
import BigNumber from "bignumber.js";
import { BigNumber as EtherBigNumber, constants } from "ethers";
import { parseUnits } from "ethers/lib/utils";

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

export function getAmountWithDecimals(
  amount: number,
  decimals: number
): string {
  return new BigNumber(10)
    .pow(decimals)
    .multipliedBy(amount)
    .toPrecision(100, 1)
    .split(".")[0]; // fix invalid input amount err caused by exponential notation
}

export const getUsdAmount = (
  amount: EtherBigNumber = constants.Zero,
  price?: number
) => {
  if (!price) return amount;
  return amount.mul(parseUnits(String(price || 1))).div(parseUnits("1"));
};

export function formatTokenDigit(value: any) {
  const bound = {
    hi: 1_000_000,
    lo: -1_000_000,
  };
  if (typeof value === "object")
    return utils.formatTokenDigit({ value: value.value, bound });

  return utils.formatTokenDigit({
    value,
    bound,
  });
}
