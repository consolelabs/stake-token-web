import {
  Badge,
  Button,
  Switch,
  Tooltip,
  Typography,
  ValueChange,
  ValueChangeIndicator,
} from "@mochi-ui/core";
import { Card } from "./Card";
import Image from "next/image";
import { utils } from "@consolelabs/mochi-formatter";
import { useDisclosure } from "@dwarvesf/react-hooks";
import { MinusLine, PlusCircleSolid, PlusLine } from "@mochi-ui/icons";
import { FlexibleStakeModal } from "../stake/flexible/flexible-stake-modal";
import { useCountdown } from "@/hooks/useCountdown";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { useFlexibleStaking } from "@/store/flexibleStaking";
import { useEffect, useState } from "react";

interface Props {
  hidden: boolean;
}

export const FlexibleStakingCard = (props: Props) => {
  const { hidden } = props;
  const { isLoggedIn } = useLoginWidget();
  const {
    apr,
    balance,
    stakedAmount,
    poolStakedAmount,
    earnedRewards,
    tokenPrice,
    autoStaking,
    setValues,
  } = useFlexibleStaking();
  const { isOpen: isBoosting, onOpen: onBoost } = useDisclosure();
  const {
    isOpen: isOpenFlexibleStakeModal,
    onOpenChange: onOpenChangeFlexibleStakeModal,
    onOpen: onOpenFlexibleStakeModal,
  } = useDisclosure();

  // FIXME: mock data
  const nftBoost = 0;
  const { countDown, hours, minutes, seconds } = useCountdown(
    isLoggedIn ? 10 : 0
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        title="ICY"
        description="Earn competitive returns by staking ICY tokens and NFTs. Fixed yield is achieved at maturity, but you can exit anytime at its current market price."
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
                color={earnedRewards ? "primary" : ""}
                className="pl-1 pr-0.5"
              >
                {utils.formatDigit({ value: earnedRewards.toFixed(2) })}
              </Typography>
              <Typography level="h9" color="textDisabled">
                ICY
              </Typography>
            </div>
          ),
          hidden,
        }}
        footerExtra={
          stakedAmount && earnedRewards ? (
            countDown ? (
              <Badge
                appearance="warning"
                className="w-fit border border-warning-soft-active ml-auto"
              >
                {`${hours}h ${minutes}m ${seconds}s`}
              </Badge>
            ) : (
              <Button variant="outline">Claim</Button>
            )
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
