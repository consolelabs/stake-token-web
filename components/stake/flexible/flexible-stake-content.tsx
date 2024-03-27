import { Button, Typography } from "@mochi-ui/core";
import { useState } from "react";
import { TokenAmount } from "@/utils/number";
import { StakeInput } from "../stake-input";

const flexibleAPR = 28.7;

interface Props {
  onStake: () => void;
}

export const FlexibleStakeContent = (props: Props) => {
  const { onStake } = props;
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });
  const balance = 23667;

  return (
    <div className="flex flex-col">
      <div className="py-3 space-y-3">
        <div className="rounded-lg bg-primary-soft px-6 py-3 space-y-0.5">
          <div className="flex items-center justify-center text-center space-x-1">
            <Typography level="h6" fontWeight="xl" color="success">
              {flexibleAPR}%
            </Typography>
            <Typography level="h6" color="primary">
              Fixed ICY
            </Typography>
          </div>
          <Typography level="p5" color="primary" className="text-center">
            Withdraw anytime at market prices
          </Typography>
        </div>
        <StakeInput {...{ amount, setAmount }} />
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
