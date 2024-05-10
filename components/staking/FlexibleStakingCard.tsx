import { Badge, Button, Typography } from "@mochi-ui/core";
import { Card } from "./Card";
import { utils } from "@consolelabs/mochi-formatter";
import { useDisclosure } from "@dwarvesf/react-hooks";
import { PlusCircleSolid } from "@mochi-ui/icons";
import { FlexibleStakeModal } from "../stake/flexible/flexible-stake-modal";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { TokenImage } from "../token-image";
import { useRecursiveTimeout } from "@/hooks/useRecursiveTimeout";
import { FlexibleUnstakeModal } from "../stake/flexible/flexible-unstake-modal";
import { formatTokenAmount } from "@/utils/number";

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
    stakingPool,
    stakingToken,
    rewardToken,
    poolContract,
    setValues,
    initializeValues,
    updateValues,
  } = useFlexibleStaking();
  const { isOpen: isBoosting } = useDisclosure();
  const {
    isOpen: isOpenFlexibleStakeModal,
    onOpenChange: onOpenChangeFlexibleStakeModal,
    onOpen: onOpenFlexibleStakeModal,
  } = useDisclosure();
  const {
    isOpen: isOpenFlexibleUnstakeModal,
    onOpenChange: onOpenChangeFlexibleUnstakeModal,
    onOpen: onOpenFlexibleUnstakeModal,
  } = useDisclosure();

  const updateRewards = async () => {
    if (!poolContract) return;
    const unclaimedRewards = await poolContract.getRewardAvailableForClaim();
    if (!unclaimedRewards) return;
    setValues({ unclaimedRewards });
  };
  useRecursiveTimeout(async () => {
    await updateRewards();
  }, 1000);

  useRecursiveTimeout(async () => {
    await updateValues();
  }, 5000);

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
            value: stakingToken?.token_price
              ? utils.formatUsdDigit(
                  formatUnits(
                    poolStakedAmount
                      .mul(parseUnits(String(stakingToken.token_price)))
                      .div(parseUnits("1")),
                    stakingToken?.token_decimal
                  )
                )
              : `${utils.formatTokenDigit(
                  formatUnits(poolStakedAmount, stakingToken?.token_decimal)
                )} ${stakingToken?.token_symbol}`,
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
            convertedValue: stakingToken?.token_price
              ? utils.formatUsdDigit(
                  formatUnits(
                    balance
                      .mul(parseUnits(String(stakingToken.token_price)))
                      .div(parseUnits("1")),
                    stakingToken?.token_decimal
                  )
                )
              : undefined,
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
            convertedValue:
              stakedAmount.isZero() || !stakingToken?.token_price
                ? undefined
                : utils.formatUsdDigit(
                    formatUnits(
                      stakedAmount
                        .mul(parseUnits(String(stakingToken.token_price)))
                        .div(parseUnits("1")),
                      stakingToken?.token_decimal
                    )
                  ),
            hidden,
          },
          // {
          //   label: "My NFTs Boost",
          //   value: nftBoost.isZero() ? (
          //     "0"
          //   ) : (
          //     <ValueChange
          //       trend={nftBoost.isNegative() ? "down" : "up"}
          //       className="!gap-0.5 font-semibold"
          //     >
          //       <ValueChangeIndicator>
          //         {nftBoost.isNegative() ? (
          //           <MinusLine className="h-2 w-2" />
          //         ) : (
          //           <PlusLine className="h-3 w-3" />
          //         )}
          //       </ValueChangeIndicator>
          //       {utils.formatPercentDigit(
          //         formatUnits(nftBoost, stakingToken?.token_decimal)
          //       )}
          //     </ValueChange>
          //   ),
          //   hidden,
          // },
          // ...(isBoosting
          //   ? [
          //       {
          //         value: (
          //           <div className="flex items-center space-x-1">
          //             {["/nft/wood.png", "/nft/thor-hammer.png"].map((src) => (
          //               <Image
          //                 key={src}
          //                 src={src}
          //                 alt=""
          //                 width={32}
          //                 height={32}
          //               />
          //             ))}
          //           </div>
          //         ),
          //       },
          //     ]
          //   : stakedAmount.isZero()
          //   ? []
          //   : [
          //       {
          //         value: (
          //           <Button variant="outline" onClick={onBoost} disabled>
          //             Boost
          //           </Button>
          //         ),
          //       },
          //     ]),
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
                onClick={onOpenFlexibleUnstakeModal}
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
                {
                  formatTokenAmount(
                    formatUnits(unclaimedRewards, rewardToken?.token_decimal)
                  ).display
                }
              </Typography>
              <Typography level="h9" color="textDisabled">
                {rewardToken?.token_symbol}
              </Typography>
            </div>
          ),
          hidden,
        }}
        footerExtra={null}
      />
      <FlexibleStakeModal
        open={isOpenFlexibleStakeModal}
        onOpenChange={onOpenChangeFlexibleStakeModal}
      />
      <FlexibleUnstakeModal
        open={isOpenFlexibleUnstakeModal}
        onOpenChange={onOpenChangeFlexibleUnstakeModal}
      />
    </>
  );
};
