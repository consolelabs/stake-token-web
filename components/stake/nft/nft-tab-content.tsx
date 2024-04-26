import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
  Typography,
} from "@mochi-ui/core";
import { Spinner } from "@mochi-ui/icons";
import { useWalletNetwork } from "@/hooks/useWalletNetwork";
import Image from "next/image";
import { LoginWidget } from "@mochi-web3/login-widget";
import { useState } from "react";

interface Props {
  loading?: boolean;
  empty?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const NFTTabContent = (props: Props) => {
  const { loading, empty, className, children } = props;
  const { isConnected, checkNetwork } = useWalletNetwork({
    chain: {
      id: 84532,
      name: "Base",
      rpc: "https://sepolia.base.org",
      currency: "ETH",
    },
  });
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  if (!isConnected) {
    return (
      <div
        ref={setContainer}
        className="flex flex-col items-center justify-center w-full h-full relative overflow-clip"
      >
        <Image src="/NFT-empty-view.png" alt="" width={242} height={246} />
        <div className="text-center mt-4">
          <Typography level="h6" fontWeight="lg">
            Let&apos;s connect wallet...
          </Typography>
          <Typography level="p5" color="textSecondary" className="py-1">
            Check if you have any NFTs in your collection.
          </Typography>
        </div>
        <Drawer anchor="bottom">
          <DrawerTrigger asChild>
            <Button size="lg" className="mt-4">
              Connect Wallet
            </Button>
          </DrawerTrigger>
          <DrawerPortal container={container}>
            <DrawerOverlay className="absolute" />
            <DrawerContent className="!w-full rounded-xl h-[calc(100%-60px)] absolute border border-divider">
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
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
        <Image src="/NFT-empty-view.png" alt="" width={242} height={246} />
        <Typography level="h6" fontWeight="lg">
          You don&apos;t have any NFTs yet.
        </Typography>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};
