import {
  Separator,
  Step,
  StepContent,
  StepDescription,
  StepIndicator,
  StepSeparator,
  StepTitle,
  Stepper,
  Typography,
  toast,
} from "@mochi-ui/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { utils } from "@consolelabs/mochi-formatter";
import { formatUnits } from "ethers/lib/utils";
import { retry } from "@/utils/retry";
import { TokenImage } from "@/components/token-image";

interface Props {
  amount: number;
  onSuccess: () => void;
}

export const FlexibleStakePreview = (props: Props) => {
  const { amount, onSuccess } = props;
  const {
    poolContract,
    stakingTokenContract,
    allowance,
    stakedAmount,
    stakingToken,
    updateValues,
    setValues,
  } = useFlexibleStaking();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const convertedAllowance = Number(
    formatUnits(allowance, stakingToken?.token_decimal)
  );

  const onStake = useCallback(async () => {
    if (!poolContract) return;
    try {
      setIsLoading(true);
      const txHash = await poolContract.stake(amount);
      if (!txHash) {
        throw new Error("Failed to stake");
      }
      setValues({ latestStaking: { txHash, amount } });
      // FIXME: retry to get updated values
      await retry(
        async () => {
          const newStakedAmount = await poolContract.getSenderStakedAmount();
          if (!newStakedAmount || newStakedAmount.eq(stakedAmount)) {
            throw new Error("Failed to stake");
          }
          return newStakedAmount;
        },
        3000,
        100
      );
      await updateValues();
      onSuccess();
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setIsError(true);
      toast({
        scheme: "danger",
        title: "Error",
        description:
          typeof err.message === "string" ? err.message : "Failed to stake",
      });
    }
  }, [amount, onSuccess, poolContract, setValues, stakedAmount, updateValues]);

  const onApprove = useCallback(async () => {
    if (!stakingTokenContract || !poolContract) return;
    try {
      setIsLoading(true);
      const txHash = await stakingTokenContract.approveTokenAmount(
        poolContract.getAddress(),
        amount
      );
      if (!txHash) {
        throw new Error("Failed to approve allowance");
      }
      // FIXME: retry to get updated values
      await retry(
        async () => {
          const newAllowance = await stakingTokenContract.getAllowance(
            poolContract.getAddress()
          );
          if (!newAllowance || newAllowance.eq(allowance)) {
            throw new Error("Failed to approve allowance");
          }
          return newAllowance;
        },
        3000,
        100
      );
      await updateValues();
      setStepIndex(2);
      onStake();
    } catch (err: any) {
      setIsLoading(false);
      setIsError(true);
      toast({
        scheme: "danger",
        title: "Error",
        description:
          typeof err.message === "string"
            ? err.message
            : "Failed to approve allowance",
      });
    }
  }, [
    allowance,
    amount,
    onStake,
    poolContract,
    stakingTokenContract,
    updateValues,
  ]);

  const initialStep = useRef(convertedAllowance >= amount ? 2 : 1);
  useEffect(() => {
    if (!initialStep.current) return;
    setStepIndex(initialStep.current);
    if (initialStep.current === 1) {
      onApprove();
    } else if (initialStep.current === 2) {
      onStake();
    }
    initialStep.current = 0;
  }, [initialStep, onApprove, onStake]);

  return (
    <div className="flex flex-col">
      <div className="py-3 grid grid-cols-2 gap-2 items-center">
        <Typography level="p4">You&apos;re staking</Typography>
        <Typography level="p5" className="text-text-tertiary text-right">
          {stakingToken?.token_price
            ? `~ ${utils.formatUsdDigit(amount * stakingToken.token_price)}`
            : ""}
        </Typography>
        <div className="flex items-center space-x-2">
          <TokenImage symbol={stakingToken?.token_symbol} size={24} />
          <Typography level="h7" fontWeight="lg">
            {stakingToken?.token_symbol}
          </Typography>
        </div>
        <Typography level="h5" fontWeight="lg" className="text-right">
          {utils.formatTokenDigit(amount)}
        </Typography>
      </div>
      <Separator />
      <div className="py-6">
        <Stepper
          currentStep={stepIndex}
          isLoading={isLoading}
          isError={isError}
        >
          {[
            {
              title: "Increase spending cap",
              description:
                "Please approve spending cap in your wallet extension",
            },
            {
              title: "Confirm stake",
              description:
                "Please confirm this transaction in your wallet extension",
            },
          ].map((step, index) => (
            <Step key={index}>
              <StepIndicator />
              <StepContent>
                <StepTitle>{step.title}</StepTitle>
                {stepIndex === index + 1 && (
                  <StepDescription>{step.description}</StepDescription>
                )}
              </StepContent>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
};
