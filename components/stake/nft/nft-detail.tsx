import {
  Badge,
  Button,
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  Typography,
} from "@mochi-ui/core";
import { TwinkleSolid } from "@mochi-ui/icons";
import Image from "next/image";
import clsx from "clsx";
import { useNFTStaking } from "@/store/nft-staking";
import { utils } from "@consolelabs/mochi-formatter";
import { truncateWallet } from "@/utils/string";
import { useWalletNetwork } from "@/hooks/useWalletNetwork";

interface Props {
  isStakedNFT: boolean;
  previewIndex: number;
}

export const NFTDetail = (props: Props) => {
  const { isStakedNFT, previewIndex } = props;
  const { nftContract, nftData } = useNFTStaking();
  const { isConnected, isCorrectNetwork, changeNetwork } = useWalletNetwork({
    chain: {
      id: 84532,
      name: "Base",
      rpc: "https://sepolia.base.org",
      currency: "ETH",
    },
  });

  const data = isStakedNFT ? null : nftData[previewIndex];

  if (!isConnected || !data) {
    return (
      <div className="md:border-l md:border-divider md:h-[645px] flex flex-col">
        <div className="pt-10 pb-4 flex justify-center">
          <div className="w-32 h-32 bg-background-level2 animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          <div className="w-full h-4 rounded-full bg-background-level2 animate-pulse" />
          <div className="w-1/2 h-4 rounded-full bg-background-level2 animate-pulse" />
          <div className="w-full h-4 rounded-full bg-background-level2 animate-pulse" />
          <div className="w-1/3 h-4 rounded-full bg-background-level2 animate-pulse" />
          <div className="w-3/4 h-4 rounded-full bg-background-level2 animate-pulse" />
          <div className="w-full h-4 rounded-full bg-background-level2 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-2 px-4 pt-4">
          <div className="h-[70px] rounded-lg bg-background-level2 animate-pulse" />
          <div className="h-[70px] rounded-lg bg-background-level2 animate-pulse" />
          <div className="h-[70px] rounded-lg bg-background-level2 animate-pulse" />
          <div className="h-[70px] rounded-lg bg-background-level2 animate-pulse" />
        </div>
        <div className="p-4 flex-1 content-end">
          <div className="h-12 rounded-lg bg-background-level2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <ScrollArea>
      <ScrollAreaViewport className="md:max-h-[90vh]">
        <div className="md:border-l md:border-divider md:h-[645px] flex flex-col">
          <div className="pt-10 pb-4 flex justify-center">
            {data?.image ? (
              <Image src={data.image} alt="" width={128} height={128} />
            ) : (
              <div className="w-32 h-32 bg-background-level2" />
            )}
          </div>
          <div
            className={clsx("px-4 space-y-1 text-center", {
              "py-4": !isStakedNFT,
            })}
          >
            <Typography level="h6" fontWeight="lg">
              {data?.name || "-"}
            </Typography>
            <div className="flex justify-center min-h-[22px]">
              {data?.attribute?.description && (
                <Badge>{data.attribute.description}</Badge>
              )}
            </div>
          </div>
          {isStakedNFT && (
            <div className="py-4 border-b border-divider">
              {[
                {
                  label: "Staking Quantity",
                  content: data ? (
                    <div className="flex items-center space-x-1">
                      <Typography level="h9" color="primary">
                        1
                      </Typography>
                      <Typography level="h9" className="text-text-tertiary">
                        / 10
                      </Typography>
                    </div>
                  ) : (
                    <Typography level="h9">-</Typography>
                  ),
                },
                {
                  label: "Remaining Boost Time",
                  content: data ? (
                    <div className="flex items-center space-x-1">
                      <Typography level="h9" color="primary">
                        1
                      </Typography>
                      <Typography level="h9" className="text-text-tertiary">
                        / 7 days
                      </Typography>
                    </div>
                  ) : (
                    <Typography level="h9">-</Typography>
                  ),
                },
                {
                  label: "Claimable Rewards",
                  content: data ? (
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Image src="/ICY.png" alt="" width={20} height={20} />
                        <Typography level="h9" color="primary">
                          0.0000
                        </Typography>
                        <Typography level="h9">ICY</Typography>
                      </div>
                      <Typography level="p6" className="text-text-tertiary">
                        ≈ 0.00 USD
                      </Typography>
                    </div>
                  ) : (
                    <Typography level="h9">-</Typography>
                  ),
                },
              ].map(({ label, content }) => (
                <div
                  key={label}
                  className="flex items-start justify-between px-4 py-1 space-x-0.5"
                >
                  <Typography level="p5" className="text-text-tertiary">
                    {label}
                  </Typography>
                  {content}
                </div>
              ))}
            </div>
          )}
          <div className="py-4">
            {[
              {
                label: "Contract address",
                content: data ? (
                  <Typography level="h9" color="primary">
                    {truncateWallet(nftContract?.getAddress() || "-")}
                  </Typography>
                ) : (
                  <Typography level="h9">-</Typography>
                ),
              },
              {
                label: "Token ID",
                content: data?.tokenId ? (
                  <Typography level="h9">#{data?.tokenId}</Typography>
                ) : (
                  <Typography level="h9">-</Typography>
                ),
              },
              {
                label: "Platform",
                content: data ? (
                  <Typography level="h9" color="primary">
                    Opensea
                  </Typography>
                ) : (
                  <Typography level="h9">-</Typography>
                ),
              },
              {
                label: "Blockchain",
                content: data ? (
                  <Typography level="h9">Base</Typography>
                ) : (
                  <Typography level="h9">-</Typography>
                ),
              },
            ].map(({ label, content }) => (
              <div
                key={label}
                className="flex items-center justify-between px-6 py-1 space-x-0.5"
              >
                <Typography level="p5" className="text-text-tertiary">
                  {label}
                </Typography>
                {content}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 px-4">
            {[
              {
                label: "Tier",
                content: data?.attribute?.tier || "-",
                icon: (
                  <Image
                    src="/svg/layer.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="object-scale-down"
                  />
                ),
              },
              {
                label: "Boost APR",
                content: data
                  ? utils.formatPercentDigit(data?.attribute?.boostStaking || 0)
                  : "-",
                icon: <TwinkleSolid className="w-6 h-6 text-[#F79009]" />,
              },
              {
                label: "Duration",
                content: !data
                  ? "-"
                  : data?.attribute?.duration && data.attribute.duration > 1
                  ? `${data.attribute.duration} days`
                  : `${data?.attribute?.duration || 0} day`,
                icon: (
                  <Image
                    src="/svg/fire.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="object-scale-down"
                  />
                ),
              },
              {
                label: "Item Type",
                content: data ? "Crafting" : "-",
                icon: (
                  <Image
                    src="/svg/tree.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="object-scale-down"
                  />
                ),
              },
            ].map(({ label, content, icon }) => (
              <div
                key={label}
                className="rounded-lg bg-background-level2 p-3 flex space-x-2 items-start"
              >
                <div className="flex-1 space-y-0.5">
                  <Typography level="p6" className="text-text-tertiary">
                    {label}
                  </Typography>
                  <Typography level="h9">{content}</Typography>
                </div>
                {icon}
              </div>
            ))}
          </div>
          <div className="p-4 flex-1 content-end">
            {!isCorrectNetwork ? (
              <Button size="lg" className="w-full" onClick={changeNetwork}>
                Switch to Base
              </Button>
            ) : isStakedNFT ? (
              <Button
                variant="outline"
                color="danger"
                size="lg"
                className="w-full"
              >
                Unstake
              </Button>
            ) : (
              <Button size="lg" className="w-full">
                Stake NFT
              </Button>
            )}
          </div>
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
};
