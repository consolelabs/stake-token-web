"use client";

import { Footer } from "@/components/footer";
import { LoginPopover } from "@/components/login-popover";
import { Logo } from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";
import { ROUTES } from "@/constants/routes";
import {
  Badge,
  BadgeIcon,
  Button,
  IconButton,
  Separator,
  TopBar,
  Typography,
} from "@mochi-ui/core";
import {
  ArrowRightLine,
  Discord,
  EyeHiddenSolid,
  EyeShowSolid,
  GiftSolid,
  WalletSolid,
} from "@mochi-ui/icons";
import { useLoginWidget } from "@mochi-web3/login-widget";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";

const Overview = () => {
  const { isLoggedIn } = useLoginWidget();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="overflow-y-auto h-[calc(100vh-56px)]">
      <div className="max-w-6xl pt-12 pb-16 px-4 mx-auto space-y-14">
        <div className="flex gap-8 flex-col lg:flex-row items-center lg:items-start">
          {isLoggedIn ? (
            <Typography level="h3" fontWeight="lg" className="flex-1">
              You have{" "}
              <span className="text-primary-solid">
                {showInfo ? 513.24 : "*****"}
              </span>{" "}
              ICY and{" "}
              <span className="text-danger-solid">
                {showInfo ? 1478.31 : "*****"}
              </span>{" "}
              DFG and <span className="text-success-solid">2</span> assets
              across <span className="text-secondary-solid">1</span> networks
              available to stake.
            </Typography>
          ) : (
            <Typography level="h3" fontWeight="lg" className="flex-1 pb-3">
              Log in to see your available assets to stake
            </Typography>
          )}
          {isLoggedIn && (
            <div className="rounded-2xl border border-divider bg-background-level1 p-4 w-96 max-w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Typography level="h6" fontWeight="lg">
                    My Earn
                  </Typography>
                  <IconButton
                    label="Show info"
                    variant="link"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    {showInfo ? (
                      <EyeShowSolid className="w-5 h-5 text-text-disabled" />
                    ) : (
                      <EyeHiddenSolid className="w-5 h-5 text-text-disabled" />
                    )}
                  </IconButton>
                </div>
                <WalletSolid className="w-5 h-5 text-text-icon-primary" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-divider">
                <div className="space-y-0.5">
                  <Typography level="p6" className="text-text-tertiary">
                    Total amount staked
                  </Typography>
                  <Typography level="h6" fontWeight="lg">
                    {showInfo ? "$1,264.32" : "*********"}
                  </Typography>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Image src="/ICY.png" alt="icy" width={20} height={20} />
                  <Image src="/DFG.png" alt="dfg" width={20} height={20} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 items-center py-3">
                <div className="space-y-0.5">
                  <Typography level="p6" className="text-text-tertiary">
                    Rewards earned
                  </Typography>
                  <Typography level="h6" fontWeight="lg" color="success">
                    {showInfo ? "0" : "********"}
                  </Typography>
                </div>
                <div className="space-y-0.5">
                  <Typography level="p6" className="text-text-tertiary">
                    NFT staking
                  </Typography>
                  <Typography level="h6" fontWeight="lg">
                    {showInfo ? "0" : "********"}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 w-fit mx-auto gap-4 md:[&>*]:col-span-2 md:[&>*:last-child]:col-start-2 lg:[&>*]:col-span-1 lg:[&>*:last-child]:col-start-auto">
          {[
            {
              key: "ICY",
              avatar: "/ICY.png",
              title: "ICY",
              description:
                "Earn competitive returns by staking ICY tokens and NFTs. Fixed yield is achieved at maturity, but you can exit anytime at its current market price.",
              info: {
                left: {
                  title: "Wallet Balance",
                  value: isLoggedIn ? (showInfo ? "513.24" : "*****") : "--",
                },
                right: {
                  title: "Token Price",
                  value: "1 ICY ≈ $1.5",
                },
                center: {
                  title: "Fixed APR",
                  value: "28.7",
                  unit: "%",
                },
              },
              action: (
                <Link href={ROUTES.EARN.FLEXIBLE_YIELD}>
                  <Button size="lg" className="w-full">
                    Stake
                  </Button>
                </Link>
              ),
            },
            {
              key: "DFG",
              avatar: "/DFG.png",
              title: "DFG",
              description:
                "DFG is a tradable and transferable representation of ICY, along with staking rewards. ICY becomes more valuable over time as you stake and accumulate DFG rewards.",
              info: {
                left: {
                  title: "Wallet Balance",
                  value: isLoggedIn ? (showInfo ? "513.24" : "*****") : "--",
                },
                right: {
                  title: "Token Price",
                  value: "1 DFG ≈ $1.5",
                },
                center: {
                  title: "Fixed APR",
                  value: "28.7",
                  unit: "%",
                },
              },
              action: (
                <Link href={ROUTES.EARN.FIXED_YIELD}>
                  <Button size="lg" className="w-full">
                    Stake
                  </Button>
                </Link>
              ),
            },
            {
              key: "Dwarves NFT collection",
              avatar: "/nft/thor-hammer.png",
              title: "Dwarves NFT collection",
              description:
                "The Dwarves NFT collection takes you to the magical world of the Norse dwarves, where brave warriors, skilled blacksmiths, and clever inventors live.",
              info: {
                left: {
                  title: "Your NFT",
                  value: isLoggedIn ? (showInfo ? "0" : "*****") : "--",
                },
                right: {
                  title: "NFT staking",
                  value: isLoggedIn ? (showInfo ? "0" : "*****") : "--",
                },
                center: {
                  title: "Average Booting Attached",
                  value: "25",
                  unit: "%",
                },
              },
              action: (
                <Button size="lg" className="w-full">
                  Stake
                </Button>
              ),
            },
          ].map((each) => (
            <div
              key={each.key}
              className="rounded-2xl border border-divider p-4 space-y-4 max-w-sm flex flex-col"
            >
              <Badge
                appearance="neutral"
                className="border border-neutral-soft-active w-fit"
              >
                <BadgeIcon>
                  <Image src="/base.png" alt="base" width={16} height={16} />
                </BadgeIcon>
                <Typography level="p5">Base</Typography>
              </Badge>
              <Image
                src={each.avatar}
                alt=""
                width={72}
                height={72}
                className="mx-auto rounded-full"
              />
              <Typography className="text-xl font-semibold text-center">
                {each.title}
              </Typography>
              <Typography level="p5" className="flex-1">
                {each.description}
              </Typography>
              <div className="flex items-center text-center">
                <div className="space-y-0.5 flex-1">
                  <Typography level="p6" className="text-text-tertiary">
                    {each.info.left.title}
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {each.info.left.value}
                  </Typography>
                </div>
                <Separator orientation="vertical" className="!h-8" />
                <div className="space-y-0.5 flex-1">
                  <Typography level="p6" className="text-text-tertiary">
                    {each.info.right.title}
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {each.info.right.value}
                  </Typography>
                </div>
              </div>
              <div className="rounded-lg border border-divider bg-background-level1 p-4 space-y-2">
                <Typography level="h9" color="primary" className="text-center">
                  {each.info.center.title}
                </Typography>
                <div className="flex items-baseline justify-center space-x-1">
                  <Typography level="h5" fontWeight="lg">
                    {each.info.center.value}
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {each.info.center.unit}
                  </Typography>
                </div>
              </div>
              {each.action}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#17181C] h-[420px] overflow-hidden">
        <div className="max-w-6xl px-4 mx-auto h-full flex items-center relative">
          <div className="absolute w-max right-1/2 translate-x-1/2 md:right-4 md:translate-x-0 grid grid-cols-4 gap-3">
            <div className="w-[290px] h-[290px] rounded-full bg-[#2CA0E2] blur-[120px] absolute -left-1/4 bottom-0" />
            <div className="w-[290px] h-[290px] rounded-full bg-[#2CA0E2] blur-[120px] absolute -right-1/4 bottom-0" />
            {[
              "/nft/anvil.png",
              "/nft/amanita-muscaria.png",
              "/nft/andvaranaut-ring.png",
              "/nft/crow-feathers.png",
              "/nft/fire-magic.png",
              "/nft/galdrar.png",
              "/nft/gold.png",
              "/nft/golden-apple.png",
              "/nft/gungnir.png",
              "/nft/iron.png",
              "/nft/jarngreipr.png",
              "/nft/leather.png",
              "/nft/loki-sword.png",
              "/nft/norns-spindle.png",
              "/nft/oak-leaves.png",
              "/nft/oak-planks.png",
              "/nft/odin-blessing.png",
              "/nft/potion-strength.png",
              "/nft/stone.png",
              "/nft/thor-hammer.png",
              "/nft/tool.png",
              "/nft/vali-manteau.png",
              "/nft/vidar-boots.png",
              "/nft/voluspa.png",
              "/nft/wood.png",
            ].map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={100}
                height={100}
                className="z-10"
              />
            ))}
            <div className="w-[166px] h-[290px] -rotate-45 rounded-full bg-[#F268EA] blur-[90px] absolute -left-1/4 top-0 z-10" />
          </div>
          <div className="absolute left-0 w-full h-full bg-gradient-to-r from-[#17181C] z-10" />
          <div className="w-full max-w-lg z-10">
            <Typography level="h4" fontWeight="lg" className="text-white">
              ⚡️ Dwarves NFT Collection
            </Typography>
            <Typography level="p3" className="text-white py-4">
              Claim exclusive NFT to celebrate Dwarves Foundation&apos;s
              monthly, quarterly, and yearly titles
            </Typography>
            <div className="pt-6 space-x-3">
              <Link href={ROUTES.NFT}>
                <Button size="lg" className="w-36">
                  Mint
                </Button>
              </Link>
              <Button size="lg" variant="link">
                Learn more
                <ArrowRightLine className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl pt-16 pb-24 px-4 mx-auto space-y-2 flex flex-col items-center">
        <Typography level="h4" fontWeight="lg" className="text-center pb-6">
          Start earning in 5 steps
        </Typography>
        {[
          {
            title: "Connect Discord",
            description:
              "To check if you're real person, we'd like you to connect your Discord account.",
            action: (
              <Button>
                Connect Social
                <Discord className="w-4 h-4" />
              </Button>
            ),
          },
          {
            title: "Connect Wallet",
            description:
              "Connect your wallet so we can calculate your points based on your onchain activity with DeFi protocols and NFTs on other networks. Use your most active wallet for more points.",
            action: (
              <Button>
                Connect Wallet
                <WalletSolid className="w-4 h-4" />
              </Button>
            ),
          },
          {
            title: "Stake ICY",
            description: (
              <>
                Stake ICY to receive DFG and revenue share rewards. Learn more
                how to{" "}
                <Link
                  href="https://memo.d.foundation/earn"
                  target="_blank"
                  className="border-b border-text-secondary"
                >
                  earn ICY
                </Link>
                .
              </>
            ),
            action: (
              <Link href={ROUTES.EARN.FLEXIBLE_YIELD}>
                <Button>Stake tokens</Button>
              </Link>
            ),
          },
          {
            title: "Get NFT",
            description: (
              <>
                Achieve Dwarves Foundation&apos;s monthly, quarterly, and yearly
                titles and receive NFTs. Check the{" "}
                <Link
                  href="https://memo.d.foundation/earn"
                  target="_blank"
                  className="border-b border-text-secondary"
                >
                  whitelist
                </Link>
                .
              </>
            ),
            action: (
              <Link href={ROUTES.NFT}>
                <Button>Mint NFT</Button>
              </Link>
            ),
          },
          {
            title: "Stake NFT",
            description: "Generate rewards and profit by staking NFT.",
            action: <Button disabled>Stake NFT</Button>,
          },
          {
            icon: <GiftSolid className="w-6 h-6 text-success-solid" />,
            title: "Claim rewards",
            description: "Complete the quest and claim rewards.",
            action: <Button disabled>Claim</Button>,
          },
        ].map(({ icon, title, description, action }, index) => (
          <div
            key={title}
            className="rounded-lg border border-divider px-6 py-4 w-full max-w-2xl flex items-center flex-col md:flex-row gap-x-8 gap-y-4"
          >
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center space-x-4">
                {icon || (
                  <div className="text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full border border-neutral-solid">
                    {index + 1}
                  </div>
                )}
                <Typography className="text-xl font-semibold">
                  {title}
                </Typography>
              </div>
              <Typography level="p5" color="textSecondary">
                {description}
              </Typography>
            </div>
            {action}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default function Page() {
  const { isLoggedIn } = useLoginWidget();

  return (
    <main>
      <TopBar
        leftSlot={<Logo />}
        rightSlot={!isLoggedIn ? <LoginPopover /> : <ProfileDropdown />}
      />
      <Suspense>
        <Overview />
      </Suspense>
    </main>
  );
}
