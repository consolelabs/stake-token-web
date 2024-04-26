import { Button, Switch, Tooltip, Typography } from "@mochi-ui/core";
import {
  ArrowTopRightLine,
  CheckCircleHalfColoredLine,
  CheckLine,
} from "@mochi-ui/icons";
import { formatUnixTimestampToDateTime } from "@/utils/datetime";
import { useFlexibleStaking } from "@/store/flexible-staking";
import Link from "next/link";
import { formatTokenAmount } from "@/utils/number";
import { TokenImage } from "@/components/token-image";

interface Props {
  onClose: () => void;
}

export const FlexibleStakeResponse = (props: Props) => {
  const { onClose } = props;
  const {
    rewardClaimableDate,
    autoStaking,
    latestStaking,
    stakingToken,
    setValues,
  } = useFlexibleStaking();
  const { txHash, amount = 0 } = latestStaking || {};

  const stakeDate = Math.floor(Date.now() / 1000);

  return (
    <>
      <div className="space-y-5">
        <div className="rounded-full bg-success-plain-active w-24 h-24 flex items-center justify-center border-[16px] border-success-soft mx-auto">
          <CheckCircleHalfColoredLine className="w-10 h-10 text-success-solid" />
        </div>
        <Typography level="h6" fontWeight="lg" className="text-center">
          Stake Successful
        </Typography>
        <div className="flex items-center justify-between">
          <Typography level="p4" className="text-text-tertiary">
            You’re staking
          </Typography>
          <div className="flex items-center space-x-1">
            <TokenImage symbol={stakingToken?.token_symbol} size={24} />
            <Typography level="h7" fontWeight="lg">
              {formatTokenAmount(amount).display} {stakingToken?.token_symbol}
            </Typography>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-soft-active bg-background-level1 p-4 space-y-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center bg-black rounded-full border border-black">
                <CheckLine className="w-4 h-4 text-white" />
              </div>
              <Typography level="h9">Stake date</Typography>
            </div>
            <Typography level="p5">
              {formatUnixTimestampToDateTime(stakeDate)}
            </Typography>
          </div>
          <div className="flex items-center justify-between relative">
            <div className="absolute -top-7 left-3 -translate-x-1/2 h-7 border-r border-neutral-soft-active" />
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-solid">
                <Typography className="text-xs font-semibold">2</Typography>
              </div>
              <Typography level="h9">Value date</Typography>
            </div>
            <Typography level="p5">
              {formatUnixTimestampToDateTime(stakeDate)}
            </Typography>
          </div>
          <div className="flex items-center justify-between relative">
            <div className="absolute -top-7 left-3 -translate-x-1/2 h-7 border-r border-neutral-soft-active" />
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-solid-disable-fg">
                <Typography className="text-xs font-semibold">3</Typography>
              </div>
              <Typography level="h9">Interest distribution date</Typography>
            </div>
            <Typography level="p5">
              {formatUnixTimestampToDateTime(rewardClaimableDate)}
            </Typography>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip
            content="Auto-Staking automates the process of topping up your margin wallet, saving you from manually transferring funds before each trade. This is especially useful if you plan on making frequent trades."
            className="max-w-xs text-center z-50"
            arrow="bottom-center"
          >
            <Switch
              checked={autoStaking}
              onCheckedChange={(autoStaking) => setValues({ autoStaking })}
            />
          </Tooltip>
          <Typography level="p5">Auto-Staking</Typography>
          <Typography level="p5" className="text-text-tertiary">
            Potential for profit maximization
          </Typography>
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
