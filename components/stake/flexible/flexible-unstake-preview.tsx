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
import { formatTokenAmount } from "@/utils/number";
import { constants } from "ethers";

interface Props {
  onSuccess: () => void;
}

export const FlexibleUnstakePreview = (props: Props) => {
  const { onSuccess } = props;
  const {
    poolContract,
    stakedAmount,
    stakingToken,
    rewardToken,
    latestUnstaking,
    updateValues,
    setValues,
  } = useFlexibleStaking();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const { amount = 0 } = latestUnstaking || {};

  const onClaimRewards = useCallback(async () => {
    if (!poolContract) return;
    try {
      setIsLoading(true);
      const txHash = await poolContract.claimReward();
      if (!txHash) {
        throw new Error("Failed to stake");
      }
      let unclaimedRewards = constants.Zero;
      // FIXME: retry to get updated values
      await retry(
        async () => {
          const newUnclaimedRewards =
            await poolContract.getRewardAvailableForClaim();
          if (newUnclaimedRewards?.gte(unclaimedRewards)) {
            unclaimedRewards = newUnclaimedRewards;
          }
          if (
            !newUnclaimedRewards ||
            newUnclaimedRewards.gte(unclaimedRewards)
          ) {
            throw new Error("Failed to claim rewards");
          }
          return newUnclaimedRewards;
        },
        3000,
        100
      );
      setValues((values) => ({
        latestUnstaking: {
          ...values.latestUnstaking!,
          rewards: Number(
            formatUnits(unclaimedRewards, rewardToken?.token_decimal)
          ),
        },
      }));
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
  }, [
    onSuccess,
    poolContract,
    rewardToken?.token_decimal,
    setValues,
    updateValues,
  ]);

  const onUnstake = useCallback(async () => {
    if (!poolContract) return;
    try {
      setIsLoading(true);
      const txHash = await poolContract.unstakeWithAmount(amount);
      if (!txHash) {
        throw new Error("Failed to stake");
      }
      setValues((values) => ({
        latestUnstaking: {
          ...values.latestUnstaking!,
          txHash,
          date: new Date(),
        },
      }));
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
      setStepIndex(2);
      onClaimRewards();
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
  }, [
    amount,
    onClaimRewards,
    poolContract,
    setValues,
    stakedAmount,
    updateValues,
  ]);

  const initialStep = useRef(1);
  useEffect(() => {
    if (!initialStep.current) return;
    setStepIndex(initialStep.current);
    onUnstake();
    initialStep.current = 0;
  }, [onUnstake]);

  return (
    <div className="flex flex-col">
      <div className="py-3 grid grid-cols-2 gap-2 items-center">
        <Typography level="p4">You&apos;re unstaking</Typography>
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
          {formatTokenAmount(amount).display}
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
              title: "Unstake amount",
              description:
                "Please confirm this transaction in your wallet extension",
            },
            {
              title: "Claim rewards",
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
