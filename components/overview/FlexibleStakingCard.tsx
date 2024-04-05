import {
  Badge,
  Button,
  Switch,
  Tooltip,
  Typography,
  ValueChange,
  ValueChangeIndicator,
  toast,
} from "@mochi-ui/core";
import { Card } from "./Card";
import Image from "next/image";
import { utils } from "@consolelabs/mochi-formatter";
import { useDisclosure } from "@dwarvesf/react-hooks";
import { MinusLine, PlusCircleSolid, PlusLine, Spinner } from "@mochi-ui/icons";
import { FlexibleStakeModal } from "../stake/flexible/flexible-stake-modal";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { useEffect, useState } from "react";
import { Countdown } from "./Countdown";
import { useTokenStaking } from "@/store/token-staking";
import { retry } from "@/utils/retry";

interface Props {
  hidden: boolean;
}

export const FlexibleStakingCard = (props: Props) => {
  const { hidden } = props;
  const { stakingTokens } = useTokenStaking();
  const {
    apr,
    balance,
    stakedAmount,
    unclaimedRewards,
    poolStakedAmount,
    nftBoost,
    tokenPrice,
    autoStaking,
    finishTime,
    poolContract,
    setValues,
    updateValues,
  } = useFlexibleStaking();
  const { isOpen: isBoosting, onOpen: onBoost } = useDisclosure();
  const {
    isOpen: isOpenFlexibleStakeModal,
    onOpenChange: onOpenChangeFlexibleStakeModal,
    onOpen: onOpenFlexibleStakeModal,
  } = useDisclosure();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const data = stakingTokens.find((each) => each.type === "flexible");

  const onClaim = async () => {
    if (!poolContract) return;
    try {
      setIsClaiming(true);
      const txHash = await poolContract.claimReward();
      if (!txHash) {
        throw new Error("Failed to claim rewards");
      }
      // FIXME: retry to get updated values
      const newUnclaimedRewards = await retry(
        async () => {
          const newUnclaimedRewards =
            await poolContract.getRewardAvailableForClaim();
          if (newUnclaimedRewards?.value !== unclaimedRewards) {
            return newUnclaimedRewards?.value;
          } else {
            throw new Error("Something went wrong");
          }
        },
        3000,
        100
      );
      if (!newUnclaimedRewards && newUnclaimedRewards !== 0) {
        throw new Error("Failed to get updated values");
      }
      await updateValues();
    } catch (err: any) {
      toast({
        scheme: "danger",
        title: "Error",
        description:
          typeof err.message === "string"
            ? err.message
            : "Failed to claim rewards",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const onUnstake = async () => {
    if (!poolContract) return;
    try {
      setIsUnstaking(true);
      const txHash = await poolContract.unstake();
      if (!txHash) {
        throw new Error("Failed to unstake");
      }
      // FIXME: retry to get updated values
      const newStakedAmount = await retry(
        async () => {
          const newStakedAmount = await poolContract.getSenderStakedAmount();
          if (newStakedAmount?.value !== stakedAmount) {
            return newStakedAmount?.value;
          } else {
            throw new Error("Something went wrong");
          }
        },
        3000,
        100
      );
      if (!newStakedAmount && newStakedAmount !== 0) {
        throw new Error("Failed to get updated values");
      }
      await updateValues();
    } catch (err: any) {
      toast({
        scheme: "danger",
        title: "Error",
        description:
          typeof err.message === "string" ? err.message : "Failed to unstake",
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !data) {
    return null;
  }

  return (
    <>
      <Card
        isBoosting={isBoosting}
        tags={[
          <Badge key="type" className="border border-primary-soft-active">
            Flexible
          </Badge>,
        ]}
        headerExtra={[
          <Tooltip
            key="auto-staking"
            content="Auto-Staking automates the process of topping up your margin wallet, saving you from manually transferring funds before each trade. This is especially useful if you plan on making frequent trades."
            className="max-w-xs text-center z-50"
            arrow="bottom-center"
          >
            <Switch
              checked={autoStaking}
              onCheckedChange={(autoStaking) => setValues({ autoStaking })}
            />
          </Tooltip>,
        ]}
        icon={<Image src="/ICY.png" alt="" width={24} height={24} />}
        title={data.staking_token?.token_symbol}
        description={data.description}
        highlightItems={[
          { label: "Fixed APY", value: utils.formatPercentDigit(apr) },
          {
            label: "TVL",
            value: utils.formatUsdDigit(poolStakedAmount * tokenPrice),
          },
        ]}
        items={[
          {
            label: "Wallet Balance",
            value: (
              <div className="flex items-center space-x-0.5">
                <Typography level="h9">
                  {utils.formatTokenDigit(balance)}
                </Typography>
                <Typography level="h9" color="textDisabled">
                  ICY
                </Typography>
              </div>
            ),
            convertedValue: utils.formatUsdDigit(balance * tokenPrice),
            hidden,
          },
          {
            label: "Total Staked",
            value: (
              <div className="flex items-center space-x-0.5">
                <Typography level="h9">
                  {utils.formatTokenDigit(stakedAmount)}
                </Typography>
                <Typography level="h9" color="textDisabled">
                  ICY
                </Typography>
              </div>
            ),
            convertedValue: stakedAmount
              ? utils.formatUsdDigit(stakedAmount * tokenPrice)
              : undefined,
            hidden,
          },
          {
            label: "My NFTs Boost",
            value: nftBoost ? (
              <ValueChange
                trend={nftBoost < 0 ? "down" : "up"}
                className="!gap-0.5 font-semibold"
              >
                <ValueChangeIndicator>
                  {nftBoost < 0 ? (
                    <MinusLine className="h-2 w-2" />
                  ) : (
                    <PlusLine className="h-3 w-3" />
                  )}
                </ValueChangeIndicator>
                {Math.abs(nftBoost).toFixed(1)}%
              </ValueChange>
            ) : (
              "0"
            ),
            hidden,
          },
          ...(isBoosting
            ? [
                {
                  value: (
                    <div className="flex items-center space-x-1">
                      {["/nft/wood.png", "/nft/thor-hammer.png"].map((src) => (
                        <Image
                          key={src}
                          src={src}
                          alt=""
                          width={32}
                          height={32}
                        />
                      ))}
                    </div>
                  ),
                },
              ]
            : stakedAmount
            ? [
                {
                  value: (
                    <Button variant="outline" onClick={onBoost}>
                      Boost
                    </Button>
                  ),
                },
              ]
            : []),
        ]}
        actions={
          stakedAmount ? (
            [
              <Button
                key="unstake"
                variant="outline"
                className="bg-background-level1"
                disabled={isUnstaking}
                onClick={onUnstake}
              >
                Unstake
              </Button>,
              <Button key="stake" onClick={onOpenFlexibleStakeModal}>
                Stake More
                <PlusCircleSolid className="w-4 h-4" />
              </Button>,
            ]
          ) : (
            <Button className="col-span-2" onClick={onOpenFlexibleStakeModal}>
              Stake
              <PlusCircleSolid className="w-4 h-4" />
            </Button>
          )
        }
        claimableRewards={{
          value: (
            <div className="flex items-center">
              <Image src="/ICY.png" alt="" width={20} height={20} />
              <Typography
                level="h9"
                color={unclaimedRewards ? "primary" : ""}
                className="pl-1 pr-0.5"
              >
                {utils.formatTokenDigit(unclaimedRewards)}
              </Typography>
              <Typography level="h9" color="textDisabled">
                {data.reward_token?.token_symbol}
              </Typography>
            </div>
          ),
          hidden,
        }}
        footerExtra={
          stakedAmount && unclaimedRewards && finishTime ? (
            <Countdown finishTime={finishTime}>
              <Button variant="outline" disabled={isClaiming} onClick={onClaim}>
                {isClaiming && <Spinner className="w-4 h-4" />}
                {isClaiming ? "Claiming" : "Claim"}
              </Button>
            </Countdown>
          ) : null
        }
      />
      <FlexibleStakeModal
        open={isOpenFlexibleStakeModal}
        onOpenChange={onOpenChangeFlexibleStakeModal}
      />
    </>
  );
};
