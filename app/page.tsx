"use client";

import { LoginPopover } from "@/components/login-popover";
import { Logo } from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";
import {
  Avatar,
  Badge,
  BadgeIcon,
  Button,
  IconButton,
  Separator,
  TopBar,
  Typography,
} from "@mochi-ui/core";
import {
  Discord,
  EyeHiddenSolid,
  EyeShowSolid,
  WalletSolid,
} from "@mochi-ui/icons";
import { useLoginWidget } from "@mochi-web3/login-widget";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { isLoggedIn } = useLoginWidget();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <main>
      <TopBar
        leftSlot={<Logo />}
        rightSlot={!isLoggedIn ? <LoginPopover /> : <ProfileDropdown />}
      />
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
                    <Avatar src="" className="w-[20px] h-[20px]" />
                    <Avatar src="" className="w-[20px] h-[20px]" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-fit mx-auto gap-4">
            <div className="rounded-2xl border border-divider p-4 space-y-4 max-w-sm flex flex-col">
              <Badge
                appearance="neutral"
                className="border border-neutral-soft-active w-fit"
              >
                <BadgeIcon>
                  <Avatar src="" className="w-4 h-4" />
                </BadgeIcon>
                <Typography level="p5">Solana</Typography>
              </Badge>
              <div className="text-center">
                <Avatar className="w-[72px] h-[72px]" src="" />
              </div>
              <Typography className="text-xl font-semibold text-center">
                ICY
              </Typography>
              <Typography level="p5" className="flex-1">
                Earn competitive returns by staking ICY tokens and NFTs. Fixed
                yield is achieved at maturity, but you can exit anytime at its
                current market price.
              </Typography>
              <div className="flex items-center text-center">
                <div className="space-y-0.5 flex-1">
                  <Typography level="p6" className="text-text-tertiary">
                    Wallet Balance
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {isLoggedIn ? (showInfo ? "513.24" : "*****") : "--"}
                  </Typography>
                </div>
                <Separator orientation="vertical" className="!h-8" />
                <div className="space-y-0.5 flex-1">
                  <Typography level="p6" className="text-text-tertiary">
                    Token Price
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    1 ICY ≈ $1.5
                  </Typography>
                </div>
              </div>
              <div className="rounded-lg border border-divider bg-background-level1 p-4 space-y-2">
                <Typography level="h9" color="primary" className="text-center">
                  Fixed APR
                </Typography>
                <div className="flex items-baseline justify-center space-x-1">
                  <Typography level="h5" fontWeight="lg">
                    28.7
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    %
                  </Typography>
                </div>
              </div>
              <Button size="lg" className="w-full">
                Stake
              </Button>
            </div>
            <div className="rounded-2xl border border-divider p-4 space-y-4 max-w-sm flex flex-col">
              <Badge
                appearance="neutral"
                className="border border-neutral-soft-active w-fit"
              >
                <BadgeIcon>
                  <Avatar src="" className="w-4 h-4" />
                </BadgeIcon>
                <Typography level="p5">Arbitrum</Typography>
              </Badge>
              <div className="text-center">
                <Avatar className="w-[72px] h-[72px]" src="" />
              </div>
              <Typography className="text-xl font-semibold text-center">
                DFG
              </Typography>
              <Typography level="p5" className="flex-1">
                DFG is a tradable and transferable representation of ICY, along
                with staking rewards. ICY becomes more valuable over time as you
                stake and accumulate DFG rewards.
              </Typography>
              <div className="flex items-center text-center">
                <div className="space-y-0.5 flex-1">
                  <Typography level="p6" className="text-text-tertiary">
                    Wallet Balance
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {isLoggedIn ? (showInfo ? "513.24" : "*****") : "--"}
                  </Typography>
                </div>
                <Separator orientation="vertical" className="!h-8" />
                <div className="space-y-0.5 flex-1">
                  <Typography level="p6" className="text-text-tertiary">
                    Token Price
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    1 DFG ≈ $1.5
                  </Typography>
                </div>
              </div>
              <div className="rounded-lg border border-divider bg-background-level1 p-4 space-y-2">
                <Typography level="h9" color="primary" className="text-center">
                  Est. APR
                </Typography>
                <div className="flex items-baseline justify-center space-x-1">
                  <Typography level="h5" fontWeight="lg">
                    28.7
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    %
                  </Typography>
                </div>
              </div>
              <Button size="lg" className="w-full">
                Stake
              </Button>
            </div>
            <div className="rounded-2xl border border-divider p-4 space-y-4 max-w-sm flex flex-col md:col-span-full md:self-center lg:col-span-1 lg:self-auto">
              <Badge
                appearance="neutral"
                className="border border-neutral-soft-active w-fit"
              >
                <BadgeIcon>
                  <Avatar src="" className="w-4 h-4" />
                </BadgeIcon>
                <Typography level="p5">Arbitrum</Typography>
              </Badge>
              <div className="text-center">
                <Avatar className="w-[72px] h-[72px]" src="" />
              </div>
              <Typography className="text-xl font-semibold text-center">
                Dwarves NFT collection
              </Typography>
              <Typography level="p5" className="flex-1">
                The Dwarves NFT collection takes you to the magical world of the
                Norse dwarves, where brave warriors, skilled blacksmiths, and
                clever inventors live.
              </Typography>
              <div className="flex items-center text-center">
                <div className="space-y-0.5 flex-1">
                  <Typography level="p6" className="text-text-tertiary">
                    Your NFT
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {isLoggedIn ? (showInfo ? "0" : "*****") : "--"}
                  </Typography>
                </div>
                <Separator orientation="vertical" className="!h-8" />
                <div className="space-y-0.5 flex-1">
                  <Typography level="p6" className="text-text-tertiary">
                    NFT staking
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    {isLoggedIn ? (showInfo ? "0" : "*****") : "--"}
                  </Typography>
                </div>
              </div>
              <div className="rounded-lg border border-divider bg-background-level1 p-4 space-y-2">
                <Typography level="h9" color="primary" className="text-center">
                  Average Booting Attached
                </Typography>
                <div className="flex items-baseline justify-center space-x-1">
                  <Typography level="h5" fontWeight="lg">
                    25
                  </Typography>
                  <Typography level="h7" fontWeight="lg">
                    %
                  </Typography>
                </div>
              </div>
              <Button size="lg" className="w-full">
                Stake
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl pt-8 pb-24 px-4 mx-auto space-y-2 flex flex-col items-center">
          <Typography level="h4" fontWeight="lg" className="text-center pb-6">
            Start earning in 3 steps
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
                <Button disabled>
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
                </>
              ),
              action: <Button disabled>Stake tokens</Button>,
            },
          ].map(({ title, description, action }, index) => (
            <div
              key={title}
              className="rounded-lg border border-divider px-6 py-4 w-full max-w-2xl flex items-center gap-8"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full border border-neutral-solid">
                    {index + 1}
                  </div>
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
      </div>
    </main>
  );
}
