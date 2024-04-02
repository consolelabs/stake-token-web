import { Badge, Button } from "@mochi-ui/core";
import { Card } from "./Card";
import Image from "next/image";
import { PlusCircleSolid } from "@mochi-ui/icons";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { utils } from "@consolelabs/mochi-formatter";

interface Props {
  hidden: boolean;
}

export const NFTCard = (props: Props) => {
  const { hidden } = props;
  const { isLoggedIn } = useLoginWidget();

  // FIXME: mock data
  const data = isLoggedIn
    ? {
        myNfts: 12,
        nftsStaking: 2,
        stakedQuantity: 24,
        rewardDistributionEpoch: "1 Hour",
        totalStaked: 1,
        claimableRewards: 0,
      }
    : {
        myNfts: 0,
        nftsStaking: 0,
        stakedQuantity: 0,
        rewardDistributionEpoch: 0,
        totalStaked: 0,
        claimableRewards: 0,
      };

  return (
    <Card
      tags={[
        <Badge
          key="type"
          appearance="success"
          className="border border-success-soft-active"
        >
          NFT Boost
        </Badge>,
      ]}
      headerExtra={[
        <Button key="get-nfts" variant="link" className="h-fit pr-0 pl-0">
          Get NFTs
        </Button>,
      ]}
      icon={<Image src="/nft/thor-hammer.png" alt="" width={24} height={24} />}
      title="Dwarves NFT collection"
      description="The Dwarves NFT collection takes you to the magical world of the Norse dwarves, where brave warriors, skilled blacksmiths, and clever inventors live."
      highlightItems={[
        { label: "Avg.Boosting", value: "24.9%" },
        { label: "Total Boosters", value: "1,456" },
      ]}
      items={[
        { label: "My NFTs", value: data.myNfts, hidden },
        { label: "NFTs Staking", value: data.nftsStaking, hidden },
        { label: "Staked Quantity", value: data.stakedQuantity, hidden },
        {
          label: "Reward Distribution epoch",
          value: data.rewardDistributionEpoch,
        },
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
            <Button key="stake">Stake</Button>,
          ]
        ) : (
          <Button className="col-span-2">
            Stake
            <PlusCircleSolid className="w-4 h-4" />
          </Button>
        )
      }
      claimableRewards={{
        value: `$${utils.formatDigit({
          value: data.claimableRewards.toFixed(2),
        })}`,
        hidden,
      }}
      footerExtra={
        data.totalStaked ? (
          <div className="flex items-center justify-between">
            {["/nft/wood.png", "/nft/thor-hammer.png", "/nft/anvil.png"].map(
              (src) => (
                <Image key={src} src={src} alt="" width={32} height={32} />
              )
            )}
            <div className="relative">
              <Image
                src="/nft/amanita-muscaria.png"
                alt=""
                width={32}
                height={32}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-[13px] font-bold">
                +2
              </div>
            </div>
          </div>
        ) : null
      }
    />
  );
};
