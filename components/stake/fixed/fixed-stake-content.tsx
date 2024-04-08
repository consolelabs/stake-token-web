import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mochi-ui/core";
import { useState } from "react";
import clsx from "clsx";
import { TokenAmount } from "@/utils/number";
import { StakeInput } from "../stake-input";

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

interface Props {
  onStake: () => void;
}

export const FixedStakeContent = (props: Props) => {
  const { onStake } = props;
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });
  const [duration, setDuration] = useState("");
  const balance = 23667;

  return (
    <div className="flex flex-col">
      <div className="py-3 space-y-3">
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
                  "ring-[3px] ring-primary-solid": each.duration === duration,
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
        <StakeInput {...{ amount, setAmount }} balance={0} convertedValue={0} />
      </div>
      <div className="px-6 py-2 flex items-center justify-between space-x-6">
        <Typography level="h8" color="textSecondary">
          Total Est. Rewards
        </Typography>
        <Typography level="h7" fontWeight="lg" color="success">
          0
        </Typography>
      </div>
      <Button
        size="lg"
        disabled={amount.value <= 0 || amount.value > balance}
        className="mt-3"
        onClick={onStake}
      >
        {amount.value > balance ? "Insufficient balance" : "Stake"}
      </Button>
    </div>
  );
};
