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

interface Props {
  hidden: boolean;
}

export const FixedStakingCard = (props: Props) => {
  const { hidden } = props;
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

  const data = {
    tokenPrice: 1.5,
    walletBalance: 0,
    totalStaked: 0,
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
            Fixed
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
          { label: "Est.APR", value: utils.formatPercentDigit(0) },
          { label: "TVL", value: utils.formatUsdDigit(0) },
        ]}
        items={[
          {
            label: "Wallet Balance",
            value: (
              <div className="flex items-center space-x-0.5">
                <Typography level="h9">
                  {utils.formatTokenDigit(data.walletBalance)}
                </Typography>
                <Typography level="h9" color="textDisabled">
                  DFG
                </Typography>
              </div>
            ),
            convertedValue: utils.formatUsdDigit(
              data.walletBalance * data.tokenPrice
            ),
            hidden,
          },
          {
            label: "Total Staked",
            value: (
              <div className="flex items-center space-x-0.5">
                <Typography level="h9">
                  {utils.formatTokenDigit(data.totalStaked)}
                </Typography>
                <Typography level="h9" color="textDisabled">
                  DFG
                </Typography>
              </div>
            ),
            convertedValue: data.totalStaked
              ? utils.formatUsdDigit(data.totalStaked * data.tokenPrice)
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
                {utils.formatTokenDigit(data.claimableRewards)}
              </Typography>
              <Typography level="h9" color="textDisabled">
                ICY
              </Typography>
            </div>
          ),
          hidden,
        }}
        footerExtra={null}
      />
      <FixedStakeModal
        open={isOpenFixedStakeModal}
        onOpenChange={onOpenChangeFixedStakeModal}
      />
    </>
  );
};
