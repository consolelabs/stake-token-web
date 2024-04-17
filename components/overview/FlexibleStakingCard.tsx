import {
  Badge,
  Button,
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
import { retry } from "@/utils/retry";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { TokenImage } from "../token-image";

interface Props {
  hidden: boolean;
}

export const FlexibleStakingCard = (props: Props) => {
  const { hidden } = props;
  const {
    apr,
    balance,
    stakedAmount,
    unclaimedRewards,
    poolStakedAmount,
    nftBoost,
    stakingPool,
    stakingToken,
    rewardToken,
    autoStaking,
    finishTime,
    poolContract,
    setValues,
    updateValues,
    initializeValues,
  } = useFlexibleStaking();
  const { isOpen: isBoosting, onOpen: onBoost } = useDisclosure();
  const {
    isOpen: isOpenFlexibleStakeModal,
    onOpenChange: onOpenChangeFlexibleStakeModal,
    onOpen: onOpenFlexibleStakeModal,
  } = useDisclosure();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const onClaim = async () => {
    if (!poolContract) return;
    try {
      setIsClaiming(true);
      const txHash = await poolContract.claimReward();
      if (!txHash) {
        throw new Error("Failed to claim rewards");
      }
      // FIXME: retry to get updated values
      await retry(
        async () => {
          const newUnclaimedRewards =
            await poolContract.getRewardAvailableForClaim();
          if (
            !newUnclaimedRewards ||
            newUnclaimedRewards.eq(unclaimedRewards)
          ) {
            throw new Error("Failed to claim rewards");
          }
          return newUnclaimedRewards;
        },
        3000,
        100
      );
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
      await retry(
        async () => {
          const newStakedAmount = await poolContract.getSenderStakedAmount();
          if (!newStakedAmount || newStakedAmount.eq(stakedAmount)) {
            throw new Error("Failed to unstake");
          }
          return newStakedAmount;
        },
        3000,
        100
      );
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

  useEffect(() => {
    initializeValues();
  }, [initializeValues]);

  if (!isClient) {
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
        headerExtra={
          [
            // <Tooltip
            //   key="auto-staking"
            //   content="Auto-Staking automates the process of topping up your margin wallet, saving you from manually transferring funds before each trade. This is especially useful if you plan on making frequent trades."
            //   className="max-w-xs text-center z-50"
            //   arrow="bottom-center"
            // >
            //   <Switch
            //     checked={autoStaking}
            //     onCheckedChange={(autoStaking) => setValues({ autoStaking })}
            //   />
            // </Tooltip>,
          ]
        }
        icon={<TokenImage symbol={stakingToken?.token_symbol} size={24} />}
        title={stakingToken?.token_symbol}
        description={stakingPool?.description}
        highlightItems={[
          {
            label: "Fixed APY",
            value: utils.formatPercentDigit(
              formatUnits(apr, stakingToken?.token_decimal)
            ),
          },
          {
            label: "TVL",
            value: utils.formatUsdDigit(
              formatUnits(
                poolStakedAmount
                  .mul(parseUnits(String(stakingToken?.token_price || 1)))
                  .div(parseUnits("1")),
                stakingToken?.token_decimal
              )
            ),
          },
        ]}
        items={[
          {
            label: "Wallet Balance",
            value: (
              <div className="flex items-center space-x-0.5">
                <Typography level="h9">
                  {utils.formatTokenDigit(
                    formatUnits(balance, stakingToken?.token_decimal)
                  )}
                </Typography>
                <Typography level="h9" color="textDisabled">
                  {stakingToken?.token_symbol}
                </Typography>
              </div>
            ),
            convertedValue: utils.formatUsdDigit(
              formatUnits(
                balance
                  .mul(parseUnits(String(stakingToken?.token_price || 1)))
                  .div(parseUnits("1")),
                stakingToken?.token_decimal
              )
            ),
            hidden,
          },
          {
            label: "Total Staked",
            value: (
              <div className="flex items-center space-x-0.5">
                <Typography level="h9">
                  {utils.formatTokenDigit(
                    formatUnits(stakedAmount, stakingToken?.token_decimal)
                  )}
                </Typography>
                <Typography level="h9" color="textDisabled">
                  {stakingToken?.token_symbol}
                </Typography>
              </div>
            ),
            convertedValue: stakedAmount.isZero()
              ? undefined
              : utils.formatUsdDigit(
                  formatUnits(
                    stakedAmount
                      .mul(parseUnits(String(stakingToken?.token_price || 1)))
                      .div(parseUnits("1")),
                    stakingToken?.token_decimal
                  )
                ),
            hidden,
          },
          {
            label: "My NFTs Boost",
            value: nftBoost.isZero() ? (
              "0"
            ) : (
              <ValueChange
                trend={nftBoost.isNegative() ? "down" : "up"}
                className="!gap-0.5 font-semibold"
              >
                <ValueChangeIndicator>
                  {nftBoost.isNegative() ? (
                    <MinusLine className="h-2 w-2" />
                  ) : (
                    <PlusLine className="h-3 w-3" />
                  )}
                </ValueChangeIndicator>
                {utils.formatPercentDigit(
                  formatUnits(nftBoost, stakingToken?.token_decimal)
                )}
              </ValueChange>
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
            : stakedAmount.isZero()
            ? []
            : [
                {
                  value: (
                    <Button variant="outline" onClick={onBoost}>
                      Boost
                    </Button>
                  ),
                },
              ]),
        ]}
        actions={
          stakedAmount.isZero() ? (
            <Button className="col-span-2" onClick={onOpenFlexibleStakeModal}>
              Stake
              <PlusCircleSolid className="w-4 h-4" />
            </Button>
          ) : (
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
          )
        }
        claimableRewards={{
          value: (
            <div className="flex items-center">
              <TokenImage symbol={rewardToken?.token_symbol} size={20} />
              <Typography
                level="h9"
                color={unclaimedRewards ? "primary" : ""}
                className="pl-1 pr-0.5"
              >
                {utils.formatTokenDigit(
                  formatUnits(unclaimedRewards, rewardToken?.token_decimal)
                )}
              </Typography>
              <Typography level="h9" color="textDisabled">
                {rewardToken?.token_symbol}
              </Typography>
            </div>
          ),
          hidden,
        }}
        footerExtra={
          !stakedAmount.isZero() && !unclaimedRewards.isZero() && finishTime ? (
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
