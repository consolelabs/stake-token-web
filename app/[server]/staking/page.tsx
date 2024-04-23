"use client";

import { Footer } from "@/components/footer";
import { Button, IconButton, Typography } from "@mochi-ui/core";
import { EyeHiddenSolid, EyeShowSolid } from "@mochi-ui/icons";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { Suspense, useEffect, useState } from "react";
import { FlexibleStakingCard } from "@/components/staking/FlexibleStakingCard";
import { FixedStakingCard } from "@/components/staking/FixedStakingCard";
import { NFTCard } from "@/components/staking/NFTCard";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { utils } from "@consolelabs/mochi-formatter";
import { useTokenStaking } from "@/store/token-staking";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import clsx from "clsx";
import { TokenImage } from "@/components/token-image";
import { Header } from "@/components/header/header";

const Overview = () => {
  const { isLoggedIn } = useLoginWidget();
  const { stakingPools } = useTokenStaking();
  const {
    balance,
    stakedAmount,
    totalEarnedRewards,
    stakingToken,
    rewardToken,
  } = useFlexibleStaking();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!!balance && !showInfo) {
      setShowInfo(true);
    }
  }, [balance, showInfo]);

  return (
    <div className="overflow-y-auto h-[calc(100vh-56px)] flex flex-col">
      <div className="flex-1 px-4 pt-12 pb-16 mx-auto space-y-14 max-w-6xl">
        <div className="flex flex-col gap-8 items-center lg:flex-row lg:items-start">
          {!isLoggedIn ? (
            <Typography level="h3" fontWeight="lg" className="flex-1 pb-3">
              Log in to see your available assets to stake
            </Typography>
          ) : balance.isZero() ? (
            <Typography level="h3" fontWeight="lg" className="flex-1 pb-3">
              You don&apos;t have available assets to stake in your wallet.
            </Typography>
          ) : (
            <Typography level="h3" fontWeight="lg" className="flex-1">
              You have{" "}
              <span className="text-primary-solid">
                {showInfo
                  ? utils.formatTokenDigit(
                      formatUnits(balance, stakingToken?.token_decimal)
                    )
                  : "*****"}
              </span>{" "}
              {stakingToken?.token_symbol} across{" "}
              <span className="text-secondary-solid">1</span> networks available
              to stake.
            </Typography>
          )}
          {isLoggedIn && (
            <div className="p-4 w-96 max-w-full rounded-2xl border border-divider bg-background-level1">
              <div className="flex justify-between items-center">
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
                  <Button variant="link" className="pr-0 pl-0 h-fit">
                    Claim all
                  </Button>
                  <Button variant="link" className="pr-0 pl-0 h-fit">
                    Restake
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-divider">
                <div className="space-y-0.5">
                  <Typography level="p6" className="text-text-tertiary">
                    Total amount staked
                  </Typography>
                  <Typography level="h6" fontWeight="lg">
                    {showInfo
                      ? utils.formatUsdDigit(
                          formatUnits(
                            stakedAmount
                              .mul(
                                parseUnits(
                                  String(stakingToken?.token_price || 1)
                                )
                              )
                              .div(parseUnits("1")),
                            stakingToken?.token_decimal
                          )
                        )
                      : "*********"}
                  </Typography>
                </div>
                <div className="flex items-center ml-2 space-x-1">
                  {stakingPools.map((each) => (
                    <TokenImage
                      key={each.guild_id}
                      symbol={each.staking_token.token_symbol}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 items-center py-3">
                <div className="space-y-0.5">
                  <Typography level="p6" className="text-text-tertiary">
                    Rewards earned
                  </Typography>
                  <Typography level="h6" fontWeight="lg" color="success">
                    {showInfo
                      ? utils.formatUsdDigit(
                          formatUnits(
                            totalEarnedRewards
                              .mul(
                                parseUnits(
                                  String(rewardToken?.token_price || 1)
                                )
                              )
                              .div(parseUnits("1")),
                            rewardToken?.token_decimal
                          )
                        )
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
        <div
          className={clsx("grid grid-cols-1 mx-auto gap-4", {
            "md:grid-cols-2": stakingPools.length >= 2,
            "lg:grid-cols-3": stakingPools.length >= 3,
          })}
        >
          {stakingPools.some((each) => each.type === "flexible") && (
            <FlexibleStakingCard hidden={isLoggedIn && !showInfo} />
          )}
          {stakingPools.some((each) => each.type === "fixed") && (
            <FixedStakingCard hidden={isLoggedIn && !showInfo} />
          )}
          {stakingPools.some((each) => each.type === "nft") && (
            <NFTCard hidden={isLoggedIn && !showInfo} />
          )}
        </div>
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
        <Overview />
      </Suspense>
    </main>
  );
}
