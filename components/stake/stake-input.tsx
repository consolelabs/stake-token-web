import { Button, Typography } from "@mochi-ui/core";
import { Dispatch, SetStateAction, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import clsx from "clsx";
import { utils } from "@consolelabs/mochi-formatter";
import { TokenAmount, formatTokenAmount } from "@/utils/number";
import { TokenImage } from "../token-image";
import { Token } from "@/store/token-staking";

interface Props {
  token: Token | null;
  balance?: number;
  amount: TokenAmount;
  convertedValue: number;
  setAmount: Dispatch<SetStateAction<TokenAmount>>;
  type?: "stake" | "unstake";
}

export const StakeInput = (props: Props) => {
  const {
    token,
    balance = 0,
    amount,
    convertedValue,
    setAmount,
    type = "stake",
  } = props;
  const [percent, setPercent] = useState(0);

  const onMaxAmount = () => {
    setPercent(100);
    setAmount(formatTokenAmount(balance));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Accept only a positive integer / float input
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter" ||
      e.key === "." ||
      e.key === "," ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      Number.isFinite(Number(e.key)) ||
      // allow for select all
      (e.metaKey && e.key.toLowerCase() === "a")
    ) {
      // Accept only one dot(".")
      if (amount.display.indexOf(".") !== -1 && e.key === ".") {
        e.preventDefault();
      } else {
        // Accept the first dot(".")
        return;
      }
    } else {
      e.preventDefault();
    }
    if (e.key === "-" || !Number.isFinite(Number(e.key))) {
      e.preventDefault();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedAmount = formatTokenAmount(e.target.value);
    formattedAmount.display = e.target.value;
    setAmount(formattedAmount);
    const percent = balance
      ? Math.max(0, Math.min(100, (formattedAmount.value / balance) * 100))
      : 0;
    setPercent(percent);
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedAmount = formatTokenAmount(e.target.value);
    setAmount(formattedAmount);
    const percent = balance
      ? Math.max(0, Math.min(100, (formattedAmount.value / balance) * 100))
      : 0;
    setPercent(percent);
  };

  return (
    <div className="rounded-xl bg-background-level2 p-3 space-y-3">
      <div className="flex items-center justify-between min-h-[34px]">
        <Typography level="h9" color="textSecondary">
          {type === "stake" ? "You're staking" : "You're unstaking"}
        </Typography>
        {/* <div className="flex items-center space-x-2">
          <label className="text-[13px] text-text-tertiary">Auto-Staking</label>
          <Tooltip
            content="Auto-Staking automates the process of topping up your margin wallet, saving you from manually transferring funds before each trade. This is especially useful if you plan on making frequent trades."
            className="max-w-xs text-center z-50"
            arrow="bottom-center"
          >
            <Switch />
          </Tooltip>
        </div> */}
      </div>
      <div className="rounded-lg bg-background-surface p-3 space-y-4">
        <div className="flex items-center">
          <input
            className="flex-1 min-w-0 outline-none placeholder:text-text-disabled leading-[34px] text-[32px] font-semibold text-text-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
            autoComplete="off"
            value={amount.display}
            onKeyDown={onKeyDown}
            onChange={onChange}
            onBlur={onBlur}
          />
          <Button
            variant="outline"
            size="sm"
            className="bg-primary-soft pl-2 pr-2 text-text-primary !h-9 !rounded-lg"
          >
            <TokenImage symbol={token?.token_symbol || ""} size={22} />
            {token?.token_symbol}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-full">
            <Slider.Root
              className="relative flex w-full h-2 cursor-pointer items-center [&>span:last-child]:z-10"
              value={[percent]}
              onValueChange={(value) => {
                const percent = value[0];
                setPercent(percent);
                setAmount(formatTokenAmount((balance * percent) / 100));
              }}
              max={100}
              step={1}
            >
              <Slider.Track className="bg-background-level2 relative flex-grow rounded h-2">
                <Slider.Range className="absolute bg-primary-solid rounded h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-background-surface border border-divider shadow-md rounded-full outline-none" />
            </Slider.Root>
            {[0, 25, 50, 75, 100].map((milestone) => (
              <span
                key={milestone}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-0"
                style={{
                  left: `calc(${milestone}% + ${(50 - milestone) / 6.25}px)`,
                }}
              >
                <span
                  className={clsx(
                    "block w-4 h-4 rounded-full hover:w-5 hover:h-5 cursor-pointer",
                    percent > milestone
                      ? "bg-primary-solid"
                      : "bg-background-level2"
                  )}
                  onClick={() => {
                    setPercent(milestone);
                    setAmount(formatTokenAmount((balance * milestone) / 100));
                  }}
                />
              </span>
            ))}
          </div>
          <div className="flex items-center px-2 space-x-1">
            <Typography className="!text-[13px] text-text-tertiary w-14">
              {percent.toFixed(2)}%
            </Typography>
            <Button
              variant="link"
              className="h-fit pl-0 pr-0 !text-[13px] !font-medium"
              onClick={onMaxAmount}
            >
              Max
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Typography className="!text-[13px] text-text-tertiary">
            ≈ ${utils.formatDigit({ value: convertedValue })} USD
          </Typography>
          <Typography className="!text-[13px] text-text-tertiary">
            {type === "stake" ? "Balance" : "Staking"}:{" "}
            <button onClick={onMaxAmount}>
              {utils.formatDigit({ value: balance })} {token?.token_symbol}
            </button>
          </Typography>
        </div>
      </div>
    </div>
  );
};
