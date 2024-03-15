"use client";

import { LoginPopover } from "@/components/login-popover";
import { Logo } from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";
import {
  Avatar,
  Button,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  TopBar,
  Typography,
} from "@mochi-ui/core";
import { LoginWidget, useLoginWidget } from "@mochi-web3/login-widget";
import { ArrowLeftLine } from "@mochi-ui/icons";
import { Suspense, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { utils } from "@consolelabs/mochi-formatter";
import { TokenAmount, formatTokenAmount } from "@/utils/number";

const flexibleAPR = 28.7;
const fixedDurationAPR = [
  {
    duration: "14D",
    apr: 2.79,
  },
  {
    duration: "30D",
    apr: 3.59,
  },
  {
    duration: "60D",
    apr: 5.6,
  },
  {
    duration: "120D",
    apr: 7.7,
  },
];

const Stake = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") === "fixed" ? "fixed" : "flexible";
  const [percent, setPercent] = useState(0);
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });
  const [duration, setDuration] = useState("");
  const balance = 23667;

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
    const percent = Math.max(
      0,
      Math.min(100, (formattedAmount.value / balance) * 100)
    );
    setPercent(percent);
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedAmount = formatTokenAmount(e.target.value);
    setAmount(formattedAmount);
    const percent = Math.max(
      0,
      Math.min(100, (formattedAmount.value / balance) * 100)
    );
    setPercent(percent);
  };

  return (
    <div className="pt-6 px-8 grid grid-cols-1 lg:grid-cols-[1fr,minmax(auto,512px),1fr]">
      <div className="lg:col-start-2 w-full max-w-lg mx-auto flex flex-col space-y-4">
        <Button variant="link" className="h-fit w-fit pl-0 pr-0">
          <ArrowLeftLine className="w-5 h-5 text-text-icon-primary" />
          <Typography level="h7" fontWeight="lg" color="textSecondary">
            Back
          </Typography>
        </Button>
        <div className="text-center px-2 pb-3 space-y-1">
          <Typography level="h5" fontWeight="lg">
            Stake ICY
          </Typography>
          <Typography
            level="p5"
            color="textTertiary"
            className="text-text-tertiary"
          >
            Stake ICY to receive DFG and revenue share rewards.
          </Typography>
        </div>
        <div className="rounded-2xl border border-divider shadow-input p-3 space-y-3">
          {type === "fixed" ? (
            <ToggleButtonGroup
              type="single"
              className="grid grid-cols-4 gap-x-3"
              value={duration}
              onValueChange={setDuration}
            >
              {fixedDurationAPR.map((each) => (
                <ToggleButton
                  key={each.duration}
                  value={each.duration}
                  className={clsx(
                    "flex flex-col w-full h-fit py-3 space-y-0.5 rounded-lg !bg-background-surface !border-neutral-outline-border",
                    {
                      "ring-[3px] ring-primary-solid":
                        each.duration === duration,
                    }
                  )}
                >
                  <Typography level="p5">{each.duration}</Typography>
                  <Typography level="p5" color="success" fontWeight="xl">
                    {each.apr}%
                  </Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          ) : (
            <>
              <div className="rounded-lg bg-primary-soft px-6 py-3 h-16 flex items-center justify-center space-x-1">
                <Typography level="h6" fontWeight="xl" color="success">
                  {flexibleAPR}%
                </Typography>
                <Typography level="h6" color="primary">
                  Fixed APR
                </Typography>
              </div>
              <Typography level="p5" color="primary" className="text-center">
                Withdraw anytime at market prices
              </Typography>
            </>
          )}

          <div className="rounded-xl bg-background-level2 p-3 space-y-3">
            <div className="flex items-center justify-between min-h-[34px]">
              <Typography level="h9" color="textSecondary">
                You’re staking
              </Typography>
              <div className="flex items-center space-x-2">
                <label className="text-[13px] text-text-tertiary">
                  Auto-Staking
                </label>
                <Tooltip
                  content="Auto-Staking automates the process of topping up your margin wallet, saving you from manually transferring funds before each trade. This is especially useful if you plan on making frequent trades."
                  className="max-w-xs text-center"
                  arrow="bottom-center"
                >
                  <Switch
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        onMaxAmount();
                      }
                    }}
                  />
                </Tooltip>
              </div>
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
                  className="bg-primary-soft pl-2 pr-2 text-text-primary"
                >
                  <Avatar
                    src="https://cdn.discordapp.com/emojis/1215543658854613002.png?size=240&quality=lossless"
                    className="w-[22px] h-[22px]"
                  />
                  ICY
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Slider.Root
                  className="relative flex w-full h-2 cursor-pointer items-center"
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
                <div className="flex items-center px-2 space-x-1">
                  <Typography className="!text-[13px] text-text-tertiary">
                    {percent}%
                  </Typography>
                  <Button
                    variant="link"
                    className="h-fit pl-0 pr-0 !text-[13px] !font-medium"
                    onClick={() => {
                      onMaxAmount();
                    }}
                  >
                    Max
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Typography className="!text-[13px] text-text-tertiary">
                  ≈ $0.00 USD
                </Typography>
                <Typography className="!text-[13px] text-text-tertiary">
                  Balance:{" "}
                  <button onClick={onMaxAmount}>
                    {utils.formatTokenDigit({
                      value: balance,
                      shorten: false,
                      fractionDigits: 2,
                    })}{" "}
                    ICY
                  </button>
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <Button
          size="lg"
          disabled={amount.value <= 0 || amount.value > balance}
        >
          {amount.value > balance ? "Insufficient balance" : "Stake"}
        </Button>
      </div>
    </div>
  );
};

export default function Page() {
  const { isLoggedIn, isLoggingIn } = useLoginWidget();

  return (
    <main>
      <TopBar
        leftSlot={<Logo />}
        rightSlot={!isLoggedIn ? <LoginPopover /> : <ProfileDropdown />}
      />
      {isLoggedIn ? (
        <Suspense>
          <Stake />
        </Suspense>
      ) : (
        <div className="flex items-center justify-center flex-1 w-full !min-h-[calc(100vh-56px)] bg-background-backdrop">
          {!isLoggingIn && (
            <div className="p-3 rounded-lg shadow-md bg-background-popup">
              <LoginWidget raw />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
