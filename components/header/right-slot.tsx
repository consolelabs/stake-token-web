import { IconButton, toast } from "@mochi-ui/core";
import { BellSolid } from "@mochi-ui/icons";
import { ChainProvider, useLoginWidget } from "@mochi-web3/login-widget";
import { LoginPopover } from "../login-popover";
import ProfileDropdown from "../profile-dropdown";
import { NetworkButton } from "./network-button";
import { useEffect } from "react";
import { useConnectedWallet } from "@/store/connected-wallet";

export const RightSlot = () => {
  const { isLoggedIn, wallets, getProviderByAddress } = useLoginWidget();
  const { setConnectedWallet } = useConnectedWallet();

  const connectedAddress = wallets.find(
    (w) => w.connectionStatus === "connected"
  )?.address;

  useEffect(() => {
    if (!connectedAddress) return;
    try {
      const provider = getProviderByAddress(
        connectedAddress
      ) as ChainProvider | null;
      if (!provider) {
        throw new Error("No provider connected.");
      }
      setConnectedWallet(connectedAddress, provider);
    } catch (err: any) {
      toast({
        scheme: "danger",
        title: "Error",
        description:
          typeof err.message === "string"
            ? err.message
            : "Failed to connect wallet",
      });
    }
  }, [connectedAddress, getProviderByAddress, setConnectedWallet]);

  if (!isLoggedIn) {
    return <LoginPopover />;
  }

  return (
    <div className="flex items-center space-x-3">
      <NetworkButton />
      <IconButton
        label="notification"
        variant="outline"
        color="neutral"
        className="!p-1.5"
      >
        <BellSolid className="w-5 h-5" />
      </IconButton>
      <ProfileDropdown />
    </div>
  );
};
