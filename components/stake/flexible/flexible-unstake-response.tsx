import { Button, Typography } from "@mochi-ui/core";
import { ArrowTopRightLine, CheckCircleHalfColoredLine } from "@mochi-ui/icons";
import { formatDateToDateTime } from "@/utils/datetime";
import { useFlexibleStaking } from "@/store/flexible-staking";
import Link from "next/link";
import { formatTokenAmount } from "@/utils/number";
import { TokenImage } from "@/components/token-image";
import { utils } from "@consolelabs/mochi-formatter";
import { formatUnits } from "ethers/lib/utils";
import { useRef } from "react";

interface Props {
  onClose: () => void;
}

export const FlexibleUnstakeResponse = (props: Props) => {
  const { onClose } = props;
  const { apr, latestUnstaking, stakingToken, unclaimedRewards, rewardToken } =
    useFlexibleStaking();
  const {
    txHash,
    date = new Date(),
    amount = 0,
    rewards = 0,
  } = latestUnstaking || {};
  const unclaimedRewardsRef = useRef(unclaimedRewards);

  return (
    <>
      <div className="space-y-5">
        <div className="rounded-full bg-success-plain-active w-24 h-24 flex items-center justify-center border-[16px] border-success-soft mx-auto">
          <CheckCircleHalfColoredLine className="w-10 h-10 text-success-solid" />
        </div>
        <Typography level="h6" fontWeight="lg" className="text-center">
          Unstake Successful
        </Typography>
        <div className="flex items-center justify-between">
          <Typography level="p4" className="text-text-tertiary">
            You&apos;re unstaking
          </Typography>
          <div className="flex items-center space-x-1">
            <TokenImage symbol={stakingToken?.token_symbol} size={24} />
            <Typography level="h7" fontWeight="lg">
              {formatTokenAmount(amount).display} {stakingToken?.token_symbol}
            </Typography>
          </div>
        </div>
        <div className="rounded-lg border border-divider p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Typography level="p5">Date</Typography>
            <Typography level="p5">{formatDateToDateTime(date)}</Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography level="p5">APY</Typography>
            <Typography level="p5" color="success">
              {utils.formatPercentDigit(
                formatUnits(apr, stakingToken?.token_decimal)
              )}
              /year
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography level="p5">Current reward</Typography>
            <Typography level="p5">
              {formatTokenAmount(rewards).display} {rewardToken?.token_symbol}
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography level="p5">Total received</Typography>
            <Typography level="p5">
              {formatTokenAmount(amount + rewards).display}{" "}
              {stakingToken?.token_symbol}
            </Typography>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Button size="lg" variant="outline" color="neutral" onClick={onClose}>
          Back to Home
        </Button>
        <Link
          target="_blank"
          href={`https://base-sepolia.blockscout.com/tx/${txHash}`}
        >
          <Button size="lg" className="w-full">
            View on explorer
            <ArrowTopRightLine className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </>
  );
};
