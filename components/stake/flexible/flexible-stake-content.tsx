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
import { TokenAmount } from "@/utils/number";
import { StakeInput } from "../stake-input";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { Spinner } from "@mochi-ui/icons";
import { LoginWidget } from "@mochi-web3/login-widget";
import { utils } from "@consolelabs/mochi-formatter";
import { formatUnits } from "ethers/lib/utils";
import { useWalletNetwork } from "@/hooks/useWalletNetwork";

interface Props {
  onStake: (amount: number) => Promise<void>;
  onApprove: (amount: number) => Promise<void>;
  loading: string | null;
  container: HTMLDivElement | null;
}

export const FlexibleStakeContent = (props: Props) => {
  const { onStake, onApprove, loading, container } = props;
  const { balance, allowance, apr, stakingToken } = useFlexibleStaking();
  const chain = useMemo(() => stakingToken?.token_chain_id, [stakingToken]);
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });
  const { isConnected, isCorrectNetwork, changeNetwork } = useWalletNetwork({
    chain,
  });

  const convertedBalance = Number(
    formatUnits(balance, stakingToken?.token_decimal)
  );
  const convertedAllowance = Number(
    formatUnits(allowance, stakingToken?.token_decimal)
  );

  return (
    <div className="flex flex-col">
      <div className="py-3 space-y-3">
        <div className="rounded-lg bg-primary-soft px-6 py-3 space-y-0.5">
          <div className="flex items-center justify-center text-center space-x-1">
            <Typography level="h6" fontWeight="xl" color="success">
              {utils.formatPercentDigit(
                formatUnits(apr, stakingToken?.token_decimal)
              )}
            </Typography>
            <Typography level="h6" color="primary">
              Fixed APY
            </Typography>
          </div>
          <Typography level="p5" color="primary" className="text-center">
            Withdraw anytime at market prices
          </Typography>
        </div>
        <StakeInput
          {...{ amount, setAmount }}
          balance={convertedBalance}
          convertedValue={amount.value * (stakingToken?.token_price || 1)}
          token={stakingToken}
        />
      </div>
      {isConnected && isCorrectNetwork ? (
        <Button
          size="lg"
          disabled={
            amount.value <= 0 || amount.value > convertedBalance || !!loading
          }
          className="mt-3"
          onClick={
            convertedAllowance >= amount.value
              ? () => onStake(amount.value)
              : () => onApprove(amount.value)
          }
        >
          {!!loading && <Spinner className="w-4 h-4" />}
          {loading ||
            (amount.value > convertedBalance
              ? "Insufficient balance"
              : convertedAllowance >= amount.value
              ? "Stake"
              : "Approve Spending Cap")}
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
                <LoginWidget raw onchain chain="evm" />
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      )}
    </div>
  );
};
