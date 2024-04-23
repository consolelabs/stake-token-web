import { Badge, Button } from "@mochi-ui/core";
import { Card } from "./Card";
import Image from "next/image";
import { PlusCircleSolid } from "@mochi-ui/icons";
import { useEffect, useState } from "react";
import { useDisclosure } from "@dwarvesf/react-hooks";
import { NFTModal } from "../stake/nft/nft-modal";
import { useNFTStaking } from "@/store/nft-staking";
import Link from "next/link";
import { PARAMS, ROUTES } from "@/constants/routes";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

interface Props {
  hidden: boolean;
}

export const NFTCard = (props: Props) => {
  const { hidden } = props;
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    isOpen: isOpenNFTModal,
    onOpenChange: onOpenChangeNFTModal,
    onOpen: onOpenNFTModal,
  } = useDisclosure();
  const pathname = usePathname();
  const params = useParams();
  const { nftData } = useNFTStaking();

  const images = nftData.flatMap((data) => data.image || []);

  const shouldOpenModal = searchParams.has(PARAMS.OVERVIEW.NFT);
  useEffect(() => {
    if (shouldOpenModal) {
      onOpenNFTModal();
    }
  }, [onOpenNFTModal, shouldOpenModal]);

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
          <Link key="get-nfts" href={ROUTES.NFT(params.server as string)}>
            <Button key="get-nfts" variant="link" className="h-fit pr-0 pl-0">
              Get NFTs
            </Button>
          </Link>,
        ]}
        icon={
          <Image src="/nft/thor-hammer.png" alt="" width={24} height={24} />
        }
        title="Dwarves NFT collection"
        description="The Dwarves NFT collection takes you to the magical world of the Norse dwarves, where brave warriors, skilled blacksmiths, and clever inventors live."
        highlightItems={[
          { label: "Avg.Boosting", value: "-" },
          { label: "Total Boosters", value: "-" },
        ]}
        items={[
          { label: "My NFTs", value: nftData.length, hidden },
          { label: "NFTs Staking", value: "-", hidden },
          { label: "Staked Quantity", value: "-", hidden },
          {
            label: "Reward Distribution epoch",
            value: "-",
          },
        ]}
        actions={
          nftData.length ? (
            [
              <Button
                key="unstake"
                variant="outline"
                className="bg-background-level1"
              >
                Unstake
              </Button>,
              <Button key="stake" onClick={onOpenNFTModal}>
                Stake
              </Button>,
            ]
          ) : (
            <Button className="col-span-2" onClick={onOpenNFTModal}>
              Stake
              <PlusCircleSolid className="w-4 h-4" />
            </Button>
          )
        }
        claimableRewards={{
          value: "-",
          hidden,
        }}
        footerExtra={
          images.length ? (
            <div className="flex items-center space-x-2">
              {images.slice(0, 3).map((src) => (
                <Image key={src} src={src} alt="" width={32} height={32} />
              ))}
              {images.length > 3 && (
                <div className="relative">
                  <Image
                    src="/nft/amanita-muscaria.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                  {images.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-[13px] font-bold">
                      +{images.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null
        }
      />
      <NFTModal
        open={isOpenNFTModal}
        onOpenChange={(open) => {
          onOpenChangeNFTModal(open);
          if (!open && searchParams.has(PARAMS.OVERVIEW.NFT)) {
            const nextSearchParams = new URLSearchParams(
              searchParams.toString()
            );
            nextSearchParams.delete(PARAMS.OVERVIEW.NFT);
            router.replace(`${pathname}?${nextSearchParams}`);
          }
        }}
      />
    </>
  );
};
