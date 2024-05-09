import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
  Typography,
} from "@mochi-ui/core";
import { useMemo, useState } from "react";
import { TokenAmount, formatTokenAmount } from "@/utils/number";
import { StakeInput } from "../stake-input";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { LoginWidget } from "@mochi-web3/login-widget";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useWalletNetwork } from "@/hooks/useWalletNetwork";
import { formatDate } from "@/utils/datetime";
import { utils } from "@consolelabs/mochi-formatter";

interface Props {
  container: HTMLDivElement | null;
  onConfirm: () => void;
}

export const FlexibleUnstakeContent = (props: Props) => {
  const { container, onConfirm } = props;
  const {
    stakedAmount,
    stakingToken,
    unclaimedRewards,
    rewardToken,
    apr,
    setValues,
  } = useFlexibleStaking();
  const chain = useMemo(() => stakingToken?.token_chain_id, [stakingToken]);
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });
  const { isConnected, isCorrectNetwork, changeNetwork, checkNetwork } =
    useWalletNetwork({
      chain,
    });

  const maxAmount = Number(
    formatUnits(stakedAmount, stakingToken?.token_decimal)
  );

  return (
    <div className="flex flex-col">
      <div className="p-3 space-y-3 rounded-2xl border border-divider">
        <StakeInput
          {...{ amount, setAmount }}
          balance={maxAmount}
          convertedValue={amount.value * (stakingToken?.token_price || 1)}
          token={stakingToken}
          type="unstake"
        />
        <div className="rounded-lg border border-divider p-4 space-y-2">
          <Typography level="h9" color="primary">
            Unstake now
          </Typography>
          <div className="flex items-center justify-between">
            <Typography level="p5">Today</Typography>
            <Typography level="p5">{formatDate(new Date())}</Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography level="p5">APY</Typography>
            <Typography level="p5" color="success">
              {utils.formatPercentDigit(
                formatUnits(apr, stakingToken?.token_decimal)
              )}
              /year
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography level="p5">Current reward</Typography>
            <Typography level="p5">
              {
                formatTokenAmount(
                  formatUnits(unclaimedRewards, rewardToken?.token_decimal)
                ).display
              }{" "}
              {rewardToken?.token_symbol}
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography level="p5">Total received</Typography>
            <Typography level="p5">
              {
                formatTokenAmount(
                  formatUnits(
                    unclaimedRewards.add(
                      parseUnits(amount.value ? amount.value.toString() : "0")
                    ),
                    stakingToken?.token_decimal
                  )
                ).display
              }{" "}
              {stakingToken?.token_symbol}
            </Typography>
          </div>
        </div>
      </div>
      {isConnected && isCorrectNetwork ? (
        <Button
          size="lg"
          disabled={amount.value <= 0 || amount.value > maxAmount}
          className="mt-3"
          onClick={() => {
            setValues({
              latestUnstaking: {
                txHash: "",
                date: new Date(),
                amount: amount.value,
                rewards: 0,
              },
            });
            onConfirm();
          }}
        >
          {amount.value > maxAmount ? "Insufficient amount" : "Unstake"}
        </Button>
      ) : isConnected && !isCorrectNetwork ? (
        <Button size="lg" className="mt-3" onClick={changeNetwork}>
          Switch to Base
        </Button>
      ) : (
        <Drawer anchor="bottom">
          <DrawerTrigger asChild>
            <Button size="lg" className="mt-3">
              Connect wallet
            </Button>
          </DrawerTrigger>
          <DrawerPortal container={container}>
            <DrawerOverlay />
            <DrawerContent className="!w-full rounded-xl h-[calc(100%-60px)]">
              <div className="flex justify-center items-center h-full">
                <LoginWidget
                  raw
                  onchain
                  chain="evm"
                  onWalletConnectSuccess={async () => {
                    checkNetwork();
                  }}
                />
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      )}
    </div>
  );
};
