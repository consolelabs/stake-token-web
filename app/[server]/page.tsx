"use client";

import { Footer } from "@/components/footer";
import { LoginPopover } from "@/components/login-popover";
import { Logo } from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";
import { Button, IconButton, TopBar, Typography } from "@mochi-ui/core";
import { EyeHiddenSolid, EyeShowSolid } from "@mochi-ui/icons";
import { useLoginWidget } from "@mochi-web3/login-widget";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { FlexibleStakingCard } from "@/components/overview/FlexibleStakingCard";
import { FixedStakingCard } from "@/components/overview/FixedStakingCard";
import { NFTCard } from "@/components/overview/NFTCard";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { utils } from "@consolelabs/mochi-formatter";
import { useTokenStaking } from "@/store/token-staking";

const Overview = () => {
  const { isLoggedIn } = useLoginWidget();
  const [showInfo, setShowInfo] = useState(true);
  const { balance, stakedAmount, totalEarnedRewards, tokenPrice } =
    useFlexibleStaking();
  const { fetchStakingTokens } = useTokenStaking();

  useEffect(() => {
    fetchStakingTokens();
  }, [fetchStakingTokens]);

  return (
    <div className="overflow-y-auto h-[calc(100vh-56px)]">
      <div className="max-w-6xl pt-12 pb-16 px-4 mx-auto space-y-14">
        <div className="flex gap-8 flex-col lg:flex-row items-center lg:items-start">
          {isLoggedIn ? (
            <Typography level="h3" fontWeight="lg" className="flex-1">
              You have{" "}
              <span className="text-primary-solid">
                {showInfo ? utils.formatTokenDigit(balance) : "*****"}
              </span>{" "}
              ICY and{" "}
              <span className="text-danger-solid">
                {showInfo ? utils.formatTokenDigit(0) : "*****"}
              </span>{" "}
              DFG and{" "}
              <span className="text-success-solid">
                {utils.formatTokenDigit(0)}
              </span>{" "}
              assets across <span className="text-secondary-solid">1</span>{" "}
              networks available to stake.
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
                <div className="flex items-center space-x-4">
                  <Button variant="link" className="h-fit pr-0 pl-0">
                    Claim all
                  </Button>
                  <Button variant="link" className="h-fit pr-0 pl-0">
                    Restake
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-divider">
                <div className="space-y-0.5">
                  <Typography level="p6" className="text-text-tertiary">
                    Total amount staked
                  </Typography>
                  <Typography level="h6" fontWeight="lg">
                    {showInfo
                      ? utils.formatUsdDigit(stakedAmount * tokenPrice)
                      : "*********"}
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
                    {showInfo
                      ? utils.formatUsdDigit(totalEarnedRewards * tokenPrice)
                      : "********"}
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
          <FlexibleStakingCard hidden={isLoggedIn && !showInfo} />
          <FixedStakingCard hidden={isLoggedIn && !showInfo} />
          <NFTCard hidden={isLoggedIn && !showInfo} />
        </div>
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
