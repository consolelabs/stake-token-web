import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
  Typography,
} from "@mochi-ui/core";
import { useState } from "react";
import { TokenAmount } from "@/utils/number";
import { StakeInput } from "../stake-input";
import { useFlexibleStaking } from "@/store/flexibleStaking";
import { Spinner } from "@mochi-ui/icons";
import { LoginWidget } from "@mochi-web3/login-widget";

interface Props {
  onStake: (amount: number) => Promise<void>;
  onApprove: (amount: number) => Promise<void>;
  loading: string | null;
  connected: boolean;
  container: HTMLDivElement | null;
}

export const FlexibleStakeContent = (props: Props) => {
  const { onStake, onApprove, loading, connected, container } = props;
  const { balance, allowance, apr } = useFlexibleStaking();
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });

  return (
    <div className="flex flex-col">
      <div className="py-3 space-y-3">
        <div className="rounded-lg bg-primary-soft px-6 py-3 space-y-0.5">
          <div className="flex items-center justify-center text-center space-x-1">
            <Typography level="h6" fontWeight="xl" color="success">
              {apr}%
            </Typography>
            <Typography level="h6" color="primary">
              Fixed ICY
            </Typography>
          </div>
          <Typography level="p5" color="primary" className="text-center">
            Withdraw anytime at market prices
          </Typography>
        </div>
        <StakeInput {...{ amount, setAmount, balance }} />
      </div>
      {connected ? (
        <Button
          size="lg"
          disabled={amount.value <= 0 || amount.value > balance || !!loading}
          className="mt-3"
          onClick={
            allowance >= amount.value
              ? () => onStake(amount.value)
              : () => onApprove(amount.value)
          }
        >
          {!!loading && <Spinner className="w-4 h-4" />}
          {loading ||
            (amount.value > balance
              ? "Insufficient balance"
              : allowance >= amount.value
              ? "Stake"
              : "Approve allowance")}
        </Button>
      ) : (
        <Drawer anchor="bottom">
          <DrawerTrigger asChild>
            <Button size="lg" className="mt-3">
              Connect wallet
            </Button>
          </DrawerTrigger>
          <DrawerPortal container={container}>
            <DrawerOverlay className="absolute" />
            <DrawerContent className="!w-full rounded-xl h-[calc(100%-60px)] absolute">
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
