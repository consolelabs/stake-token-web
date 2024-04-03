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
import { FixedStakeModal } from "../stake/fixed/fixed-stake-modal";
import { useEffect, useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useLoginWidget } from "@mochi-web3/login-widget";

interface Props {
  hidden: boolean;
}

export const FixedStakingCard = (props: Props) => {
  const { hidden } = props;
  const { isLoggedIn } = useLoginWidget();
  const { isOpen: isBoosting, onOpen: onBoost } = useDisclosure();
  const { isOpen: isAutoStaking, onOpenChange: onAutoStakingChange } =
    useDisclosure({
      defaultIsOpen: true,
    });
  const {
    isOpen: isOpenFixedStakeModal,
    onOpenChange: onOpenChangeFixedStakeModal,
    onOpen: onOpenFixedStakeModal,
  } = useDisclosure();

  // FIXME: mock data
  const { countDown } = useCountdown(isLoggedIn ? 10 : 0);
  const [claimableRewards, setClaimableRewards] = useState(356.7891);
  const data = isLoggedIn
    ? {
        walletBalance: 0,
        walletBalanceInUsd: 0,
        totalStaked: 514.24,
        totalStakedInUsd: 769.86,
        nftBoost: isBoosting ? 35 : 0,
        claimableRewards,
      }
    : {
        walletBalance: 0,
        walletBalanceInUsd: 0,
        totalStaked: 0,
        totalStakedInUsd: 0,
        nftBoost: 0,
        claimableRewards: 0,
      };

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
          <Badge
            key="duration"
            appearance="secondary"
            className="border border-secondary-soft-active"
          >
            120 days
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
              checked={isAutoStaking}
              onCheckedChange={onAutoStakingChange}
            />
          </Tooltip>,
        ]}
        icon={<Image src="/DFG.png" alt="" width={24} height={24} />}
        title="DFG"
        description="DFG is a tradable and transferable representation of ICY, along with staking rewards. ICY becomes more valuable over time as you stake and accumulate DFG rewards."
        highlightItems={[
          { label: "Est.APR", value: "48.9%" },
          { label: "TVL", value: "$4.23M" },
        ]}
        items={[
          {
            label: "Wallet Balance",
            value: (
              <div className="flex items-center space-x-0.5">
                <Typography level="h9">
                  {utils.formatDigit({ value: data.walletBalance.toFixed(2) })}
                </Typography>
                <Typography level="h9" color="textDisabled">
                  DFG
                </Typography>
              </div>
            ),
            convertedValue: utils.formatDigit({
              value: `$${data.walletBalanceInUsd.toFixed(2)}`,
            }),
            hidden,
          },
          {
            label: "Total Staked",
            value: (
              <div className="flex items-center space-x-0.5">
                <Typography level="h9">
                  {utils.formatDigit({ value: data.totalStaked.toFixed(2) })}
                </Typography>
                <Typography level="h9" color="textDisabled">
                  DFG
                </Typography>
              </div>
            ),
            convertedValue: data.totalStakedInUsd
              ? utils.formatDigit({
                  value: `$${data.totalStakedInUsd.toFixed(2)}`,
                })
              : undefined,
            hidden,
          },
          {
            label: "My NFTs Boost",
            value: data.nftBoost ? (
              <ValueChange
                trend={data.nftBoost < 0 ? "down" : "up"}
                className="!gap-0.5 font-semibold"
              >
                <ValueChangeIndicator>
                  {data.nftBoost < 0 ? (
                    <MinusLine className="h-2 w-2" />
                  ) : (
                    <PlusLine className="h-3 w-3" />
                  )}
                </ValueChangeIndicator>
                {Math.abs(data.nftBoost).toFixed(1)}%
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
            : data.totalStaked
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
          data.totalStaked ? (
            [
              <Button
                key="unstake"
                variant="outline"
                className="bg-background-level1"
              >
                Unstake
              </Button>,
              <Button key="stake" onClick={onOpenFixedStakeModal}>
                Stake More
                <PlusCircleSolid className="w-4 h-4" />
              </Button>,
            ]
          ) : (
            <Button className="col-span-2" onClick={onOpenFixedStakeModal}>
              Stake
              <PlusCircleSolid className="w-4 h-4" />
            </Button>
          )
        }
        claimableRewards={{
          value: (
            <div className="flex items-center">
              <Image src="/DFG.png" alt="" width={20} height={20} />
              <Typography
                level="h9"
                color={data.claimableRewards ? "primary" : ""}
                className="pl-1 pr-0.5"
              >
                {utils.formatDigit({ value: data.claimableRewards.toFixed(2) })}
              </Typography>
              <Typography level="h9" color="textDisabled">
                ICY
              </Typography>
            </div>
          ),
          hidden,
        }}
        footerExtra={
          data.totalStaked && data.claimableRewards ? (
            countDown ? (
              <Badge
                appearance="warning"
                className="w-fit border border-warning-soft-active ml-auto"
              >
                100/120D
              </Badge>
            ) : (
              <Button variant="outline" onClick={() => setClaimableRewards(0)}>
                Claim
              </Button>
            )
          ) : null
        }
      />
      <FixedStakeModal
        open={isOpenFixedStakeModal}
        onOpenChange={onOpenChangeFixedStakeModal}
      />
    </>
  );
};
