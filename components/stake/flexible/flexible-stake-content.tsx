import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
  Typography,
  toast,
} from "@mochi-ui/core";
import { useEffect, useMemo, useState } from "react";
import { TokenAmount } from "@/utils/number";
import { StakeInput } from "../stake-input";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { Spinner } from "@mochi-ui/icons";
import { LoginWidget, useLoginWidget } from "@mochi-web3/login-widget";
import { utils } from "@consolelabs/mochi-formatter";
import { useTokenStaking } from "@/store/token-staking";
import { formatUnits } from "ethers/lib/utils";

interface Props {
  onStake: (amount: number) => Promise<void>;
  onApprove: (amount: number) => Promise<void>;
  loading: string | null;
  container: HTMLDivElement | null;
}

export const FlexibleStakeContent = (props: Props) => {
  const { onStake, onApprove, loading, container } = props;
  const { isLoggedIn } = useLoginWidget();
  const { balance, allowance, apr, tokenPrice, provider } =
    useFlexibleStaking();
  const { stakingPools } = useTokenStaking();
  const chain = useMemo(
    () =>
      stakingPools.find((each) => each.type === "flexible")?.staking_token
        ?.token_chain_id,
    [stakingPools]
  );
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });
  const [isBaseChain, setIsBaseChain] = useState(
    provider?.chainId === `0x${chain?.id?.toString(16)}`
  );

  const convertedBalance = Number(formatUnits(balance));
  const convertedAllowance = Number(formatUnits(allowance));
  const isConnected = isLoggedIn && !!provider;
  const changeNetwork = async () => {
    try {
      await provider?.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chain?.id?.toString(16)}` }],
      });
      const newChainId = await provider?.provider.request({
        method: "eth_chainId",
      });
      setIsBaseChain(newChainId === `0x${chain?.id?.toString(16)}`);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await provider?.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chain?.id?.toString(16)}`,
                chainName: chain?.name,
                rpcUrls: [chain?.rpc],
                nativeCurrency: {
                  name: chain?.currency,
                  symbol: chain?.currency,
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError: any) {
          toast({
            scheme: "danger",
            title: "Error",
            description:
              typeof addError?.message === "string"
                ? addError.message
                : "Failed to add Base network",
          });
        }
      } else {
        toast({
          scheme: "danger",
          title: "Error",
          description:
            typeof switchError?.message === "string"
              ? switchError.message
              : "Failed to switch to Base network",
        });
      }
    }
  };

  useEffect(() => {
    setIsBaseChain(provider?.chainId === `0x${chain?.id?.toString(16)}`);
  }, [chain?.id, provider?.chainId]);

  return (
    <div className="flex flex-col">
      <div className="py-3 space-y-3">
        <div className="rounded-lg bg-primary-soft px-6 py-3 space-y-0.5">
          <div className="flex items-center justify-center text-center space-x-1">
            <Typography level="h6" fontWeight="xl" color="success">
              {utils.formatPercentDigit(formatUnits(apr))}
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
          convertedValue={amount.value * Number(formatUnits(tokenPrice))}
        />
      </div>
      {isConnected && isBaseChain ? (
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
      ) : isConnected && !isBaseChain ? (
        <Button size="lg" className="mt-3" onClick={changeNetwork}>
          Change Network to Base
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
