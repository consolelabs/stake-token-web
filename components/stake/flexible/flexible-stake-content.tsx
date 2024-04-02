import { Button, Typography } from "@mochi-ui/core";
import { useState } from "react";
import { TokenAmount } from "@/utils/number";
import { StakeInput } from "../stake-input";
import { useFlexibleStaking } from "@/store/flexibleStaking";
import { Spinner } from "@mochi-ui/icons";

interface Props {
  onStake: (amount: number) => Promise<void>;
  onApprove: (amount: number) => Promise<void>;
  loading: string | null;
}

export const FlexibleStakeContent = (props: Props) => {
  const { onStake, onApprove, loading } = props;
  const { balance, allowance, aprPercentage } = useFlexibleStaking();
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });

  return (
    <div className="flex flex-col">
      <div className="py-3 space-y-3">
        <div className="rounded-lg bg-primary-soft px-6 py-3 space-y-0.5">
          <div className="flex items-center justify-center text-center space-x-1">
            <Typography level="h6" fontWeight="xl" color="success">
              {aprPercentage}%
            </Typography>
            <Typography level="h6" color="primary">
              Fixed ICY
            </Typography>
          </div>
          <Typography level="p5" color="primary" className="text-center">
            Withdraw anytime at market prices
          </Typography>
        </div>
        <StakeInput {...{ amount, setAmount, balance }} />
      </div>
      <Button
        size="lg"
        disabled={amount.value <= 0 || amount.value > balance.value}
        className="mt-3"
        onClick={
          allowance.value >= amount.value
            ? () => onStake(amount.value)
            : () => onApprove(amount.value - allowance.value)
        }
      >
        {!!loading && <Spinner className="w-4 h-4" />}
        {loading ||
          (amount.value > balance.value
            ? "Insufficient balance"
            : allowance.value >= amount.value
            ? "Stake"
            : "Approve allowance")}
      </Button>
    </div>
  );
};
