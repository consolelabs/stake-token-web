import { tryCatch } from "@/utils/tryCatch";
import { toast } from "@mochi-ui/core";
import { ChainProvider, useLoginWidget } from "@mochi-web3/login-widget";
import { useEffect, useMemo, useState } from "react";

interface Props {
  chain?: { id?: number; name?: string; rpc?: string; currency?: string };
}

export const useWalletNetwork = (props: Props) => {
  const { chain } = props;
  const { wallets, getProviderByAddress } = useLoginWidget();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const connectedAddress = useMemo(
    () => wallets?.find((w) => w.connectionStatus === "connected")?.address,
    [wallets]
  );
  const { provider, chainId } = tryCatch<Partial<ChainProvider>>(
    () => getProviderByAddress(connectedAddress || "") || {},
    () => ({})
  );

  const changeNetwork = async () => {
    if (!provider) return;
    console.log("sdgdfg");
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chain?.id?.toString(16)}` }],
      });
      const newChainId = await provider.request({
        method: "eth_chainId",
      });
      setIsCorrectNetwork(newChainId === `0x${chain?.id?.toString(16)}`);
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
    setIsCorrectNetwork(chainId === `0x${chain?.id?.toString(16)}`);
  }, [chain?.id, chainId]);

  return {
    isConnected: !!connectedAddress,
    isCorrectNetwork,
    changeNetwork,
  };
};
