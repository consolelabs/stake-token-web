"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header/header";
import { NFTList } from "@/components/nft/nft-list";
import { Button, Separator, Typography } from "@mochi-ui/core";
import { ArrowTopRightLine } from "@mochi-ui/icons";
import { useLoginWidget } from "@mochi-web3/login-widget";
import Image from "next/image";
import { Suspense } from "react";

const NFT = () => {
  const { isLoggedIn } = useLoginWidget();

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
              <Typography level="p4">Lucky --</Typography>
            </div>
            <div className="flex items-center justify-center flex-1">
              <Image
                src="/nft/treasure-chest.png"
                alt=""
                width={128}
                height={128}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded bg-background-level2 px-3 py-1.5 flex items-center space-x-2">
                <Image
                  src="/svg/rocket-launch.svg"
                  alt=""
                  width={24}
                  height={24}
                />
                <Typography level="h7" fontWeight="lg">
                  --
                </Typography>
              </div>
              <div className="rounded bg-background-level2 px-3 py-1.5 flex items-center space-x-2">
                <Image src="/svg/hourglass.svg" alt="" width={24} height={24} />
                <Typography level="h7" fontWeight="lg">
                  --
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
              {[
                {
                  title: "Tier 1",
                  percent: 0.5,
                },
                {
                  title: "Tier 2",
                  percent: 2.5,
                },
                {
                  title: "Tier 3",
                  percent: 12,
                },
                {
                  title: "Tier 4",
                  percent: 35,
                },
                {
                  title: "Tier 5",
                  percent: 50,
                },
              ].map((each) => (
                <div key={each.title} className="pt-3 pb-4 space-y-0.5">
                  <Typography level="p5" className="text-text-tertiary">
                    {each.title}
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {each.percent}%
                  </Typography>
                </div>
              ))}
            </div>
            {isLoggedIn ? (
              <Button size="lg">Mint (2)</Button>
            ) : (
              <Button size="lg">Login</Button>
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
        <NFTList />
      </div>
      <Footer />
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
