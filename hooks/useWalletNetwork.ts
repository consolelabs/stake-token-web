import { useConnectedWallet } from "@/store/connected-wallet";
import { toast } from "@mochi-ui/core";
import { useCallback, useEffect, useState } from "react";

interface Props {
  chain?: { id?: number; name?: string; rpc?: string; currency?: string };
}

export const useWalletNetwork = (props: Props) => {
  const { chain } = props;
  const { address, provider: chainProvider } = useConnectedWallet();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const { provider, chainId } = chainProvider || {};

  const changeNetwork = useCallback(async () => {
    if (!provider) return;
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
          await provider.request({
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
  }, [chain?.currency, chain?.id, chain?.name, chain?.rpc, provider]);

  const [shouldChangeNetwork, setShouldChangeNetwork] = useState(false);
  const checkNetwork = () => {
    if (!isCorrectNetwork) {
      setShouldChangeNetwork(true);
    }
  };

  useEffect(() => {
    if (shouldChangeNetwork && !!provider) {
      changeNetwork();
      setShouldChangeNetwork(false);
    }
  }, [changeNetwork, provider, shouldChangeNetwork]);

  useEffect(() => {
    setIsCorrectNetwork(chainId === `0x${chain?.id?.toString(16)}`);
  }, [chain?.id, chainId]);

  return {
    isConnected: !!address,
    isCorrectNetwork,
    changeNetwork,
    checkNetwork,
  };
};
