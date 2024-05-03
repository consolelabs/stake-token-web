"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header/header";
import { NFTList } from "@/components/nft/nft-list";
import { BASE_PROVIDER_RPC } from "@/envs";
import { Abi, LUCKY_POINT, NftAddress } from "@/services";
import { NftData, useNFTStaking } from "@/store/nft-staking";
import { retry } from "@/utils/retry";
import { utils } from "@consolelabs/mochi-formatter";
import { useDisclosure } from "@dwarvesf/react-hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  Separator,
  Typography,
  toast,
} from "@mochi-ui/core";
import { ArrowTopRightLine, StarSolid } from "@mochi-ui/icons";
import { LoginWidget } from "@mochi-web3/login-widget";
import { Contract } from "ethers";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import wretch from "wretch";

const NFT = () => {
  const { nftContract, nftData, initializeNFTData } = useNFTStaking();
  const [tiers, setTiers] = useState([0, 0, 0, 0, 0]);
  const [nftList, setNftList] = useState<NftData[]>([]);
  const [displayNft, setDisplayNft] = useState<NftData | null>(null);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const {
    isOpen: isOpenLoginWidget,
    onOpen: onOpenLoginWidget,
    onOpenChange: onOpenChangeLoginWidget,
  } = useDisclosure();

  const mintNft = async () => {
    if (!nftContract) return;
    try {
      setMinting(true);
      const txHash = await nftContract.mintNft(LUCKY_POINT);
      if (!txHash) {
        throw new Error("Failed to mint NFT");
      }
      // FIXME: retry to get updated values
      await retry(
        async () => {
          const tokenIds = await nftContract.listTokenIdOfWallet();
          if (!tokenIds.length || tokenIds.length === nftData.length) {
            throw new Error("Failed to mint NFT");
          }
          return tokenIds;
        },
        3000,
        100
      );
      await initializeNFTData();
      const displayNft = nftData[nftData.length - 1];
      setDisplayNft(displayNft);
      toast({
        scheme: "success",
        title: "Congratulations! Mint succeeded!",
        description: "Claim your NFT and start using it to redeem rewards.",
      });
    } catch (err: any) {
      toast({
        scheme: "danger",
        title: "Error",
        description:
          typeof err.message === "string" ? err.message : "Failed to mint NFT",
      });
    } finally {
      setMinting(false);
    }
  };

  const claimNft = () => {
    setDisplayNft(null);
    toast({
      scheme: "success",
      title: "Successfully Claimed",
      description: (
        <Typography
          level="p7"
          fontWeight="xl"
          color="success"
          className="uppercase"
        >
          Check My NFTs
        </Typography>
      ),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (nftContract) {
        const tiers = await nftContract.getTierWeight();
        setTiers(tiers);

        setLoading(true);
        const data = await nftContract.listItemNft();
        setNftList(data);
        setLoading(false);
      } else {
        const provider = new JsonRpcProvider(BASE_PROVIDER_RPC);
        const initNftContract = new Contract(NftAddress.NFT, Abi.Nft, provider);

        // get tiers
        const initData = await Promise.all(
          [1, 2, 3, 4, 5].map((i) => initNftContract[`tier${i}Weight`]())
        );
        setTiers(initData.map((each) => Number(each.toString()) / 10));

        // get nft list
        setLoading(true);
        const baseUri = await initNftContract.getBaseUri();
        const minItemId = await initNftContract.getMintItemId();
        const maxItemId = await initNftContract.getMaxItemId();
        const items = await Promise.all(
          Array.from(
            {
              length:
                Number(maxItemId.toString()) - Number(minItemId.toString()) + 1,
            },
            (_, i) => i + 1
          ).map(async (id) => {
            const [{ name, image }, attribute] = await Promise.all([
              wretch(baseUri + id.toString())
                .get()
                .json<{ name: string; image: string }>(),
              initNftContract.getItemAttribute(id),
            ]);
            return {
              name,
              image,
              attribute: {
                ...attribute,
                duration: Number(attribute.duration.toString()),
              },
            } as NftData;
          })
        );
        setNftList(items);
        setLoading(false);
      }
    };
    fetchData();
  }, [nftContract]);

  return (
    <div className="overflow-y-auto h-[calc(100vh-56px)]">
      <div className="max-w-6xl pt-12 pb-16 px-4 mx-auto space-y-4">
        <Typography level="h4" fontWeight="lg" className="pb-6 text-center">
          NFT Farmer Event
        </Typography>
        <div className="rounded-2xl border border-neutral-outline-border p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 space-y-6 flex flex-col">
            <div className="text-center space-y-1">
              <Typography level="h6" fontWeight="lg">
                Treasure Chest
              </Typography>
              <Typography level="p4">
                Lucky{" "}
                {utils.formatPercentDigit(
                  displayNft?.attribute?.boostStaking || 10
                )}
              </Typography>
            </div>
            <div className="flex items-center justify-center flex-1">
              {displayNft?.image ? (
                <Image src={displayNft.image} alt="" width={128} height={128} />
              ) : (
                <Image
                  src="/nft/treasure-chest.png"
                  alt=""
                  width={128}
                  height={128}
                />
              )}
            </div>
            {!!displayNft && (
              <div className="text-center space-y-1">
                <Typography level="h5" fontWeight="lg">
                  {displayNft.name}
                </Typography>
                <div className="flex justify-center space-x-0.5">
                  {Array.from({ length: displayNft.attribute?.tier || 0 }).map(
                    (_, index) => (
                      <StarSolid
                        key={index}
                        className="w-5 h-5 text-warning-outline-border"
                      />
                    )
                  )}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded bg-background-level2 px-3 py-1.5 flex items-center space-x-2">
                <Image
                  src="/svg/rocket-launch.svg"
                  alt=""
                  width={24}
                  height={24}
                />
                <Typography level="h7" fontWeight="lg">
                  {displayNft?.attribute?.boostStaking
                    ? utils.formatPercentDigit(
                        displayNft.attribute.boostStaking
                      )
                    : "--"}
                </Typography>
              </div>
              <div className="rounded bg-background-level2 px-3 py-1.5 flex items-center space-x-2">
                <Image src="/svg/hourglass.svg" alt="" width={24} height={24} />
                <Typography level="h7" fontWeight="lg">
                  {displayNft?.attribute?.duration
                    ? displayNft.attribute.duration > 1
                      ? `${displayNft.attribute.duration} days`
                      : `${displayNft.attribute.duration} day`
                    : "--"}
                </Typography>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-background-level1 p-6 space-y-4 flex flex-col">
            <div className="text-right">
              <Button variant="link" className="h-fit pl-0 pr-0">
                Whitelist
                <ArrowTopRightLine className="w-4 h-4" />
              </Button>
            </div>
            <div className="pb-4 flex-1">
              <Typography level="p4">
                The Dwarves NFT collection takes you to the magical world of the
                Norse dwarves, where brave warriors, skilled blacksmiths, and
                clever inventors live. Each NFT in the collection is a unique
                piece of art, representing a different aspect of Norse dwarf
                culture.
              </Typography>
            </div>
            <Separator />
            <div className="grid grid-cols-3 sm:grid-cols-5 sm:px-2 gap-x-4">
              {tiers.map((tier, index) => (
                <div key={index} className="pt-3 pb-4 space-y-0.5">
                  <Typography level="p5" className="text-text-tertiary">
                    Tier {index + 1}
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {utils.formatPercentDigit(tier)}
                  </Typography>
                </div>
              ))}
            </div>
            {nftContract && displayNft ? (
              <Button size="lg" onClick={claimNft}>
                Claim
              </Button>
            ) : nftContract && !displayNft ? (
              <Button size="lg" onClick={mintNft} loading={minting}>
                Mint
              </Button>
            ) : (
              <Button size="lg" onClick={onOpenLoginWidget}>
                Connect wallet
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-background-level1">
        <div className="max-w-6xl py-16 px-4 mx-auto space-y-8">
          <Typography level="h4" fontWeight="lg" className="pb-6 text-center">
            Dwarves NFT Collection
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-3 w-fit h-fit">
                {[
                  "/nft/tool.png",
                  "/nft/crow-feathers.png",
                  "/nft/voluspa.png",
                  "/nft/vidar-boots.png",
                  "/nft/thor-hammer.png",
                  "/nft/golden-apple.png",
                  "/nft/anvil.png",
                  "/nft/stone.png",
                  "/nft/wood.png",
                ].map((src) => (
                  <Image key={src} src={src} alt="" width={128} height={128} />
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <Typography className="text-xl font-semibold pt-4">
                About
              </Typography>
              <Typography level="p4" className="py-4">
                The Dwarves NFT collection takes you to the magical world of the
                Norse dwarves, where brave warriors, skilled blacksmiths, and
                clever inventors live. Each NFT in the collection is a unique
                piece of art, representing a different aspect of Norse dwarf
                culture.
              </Typography>
              <Typography className="text-xl font-semibold pt-4">
                How to mint
              </Typography>
              <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
                {[
                  "Connect your wallet",
                  "Check the whitelist and mint",
                  "Confirm the transaction",
                  "Receive your NFTs",
                ].map((each, index) => (
                  <Typography key={each} level="p4">
                    {index + 1}. {each}
                  </Typography>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl pb-24 px-4 mx-auto">
        <NFTList {...{ nftList, loading }} />
      </div>
      <Footer />
      <Modal open={isOpenLoginWidget} onOpenChange={onOpenChangeLoginWidget}>
        <ModalPortal>
          <ModalOverlay />
          <ModalContent>
            <LoginWidget
              raw
              onchain
              chain="evm"
              onWalletConnectSuccess={async () => {
                onOpenChangeLoginWidget(false);
              }}
            />
          </ModalContent>
        </ModalPortal>
      </Modal>
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <Header />
      <Suspense>
        <NFT />
      </Suspense>
    </main>
  );
}
