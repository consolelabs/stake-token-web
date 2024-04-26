import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  ProfileBadge,
  DropdownMenuPortal,
  Button,
  Avatar,
  Typography,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@mochi-ui/core";
import { LoginWidget, useLoginWidget } from "@mochi-web3/login-widget";
import { ReactNode, useEffect, useRef } from "react";
import { utils } from "@consolelabs/mochi-formatter";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useFlexibleStaking } from "@/store/flexible-staking";
import Image from "next/image";
import {
  ChevronLeftLine,
  Discord,
  LifeBuoySolid,
  WalletAddSolid,
  WalletSolid,
  X,
} from "@mochi-ui/icons";
import { useWalletBalance } from "@/store/wallet-balance";
import { truncateWallet } from "@/utils/string";
import { formatUnits } from "ethers/lib/utils";
import { getUsdAmount } from "@/utils/number";
import { useDisclosure } from "@dwarvesf/react-hooks";
import Link from "next/link";

const DropdownContent = () => {
  const { profile, logout } = useLoginWidget();
  const { push } = useRouter();
  const params = useParams<{ server: string }>();
  const { walletsWithBalance, mochiWallet, getConnectedWallet } =
    useWalletBalance();
  const {
    reset: resetFlexibleStaking,
    balance: flexibleStakingBalance,
    stakingToken: flexibleStakingToken,
  } = useFlexibleStaking();
  const {
    isOpen: isOpenLoginWidget,
    onOpen: onOpenLoginWidget,
    onClose: onCloseLoginWidget,
  } = useDisclosure();

  const connectedWallet = getConnectedWallet();
  const totalBalance = formatUnits(
    getUsdAmount(flexibleStakingBalance, flexibleStakingToken?.token_price),
    flexibleStakingToken?.token_decimal
  );

  if (isOpenLoginWidget) {
    return (
      <>
        <Button
          variant="link"
          color="neutral"
          onClick={onCloseLoginWidget}
          className="!p-0"
        >
          <ChevronLeftLine className="w-4 h-4" />
          Back
        </Button>
        <LoginWidget raw onchain chain="evm" onClose={onCloseLoginWidget} />
      </>
    );
  }

  return (
    <>
      <Accordion type="single" collapsible className="!p-0 shadow-none">
        <AccordionItem value="profile">
          <AccordionTrigger
            leftIcon={<Avatar src="" className="flex" />}
            className="flex-col items-start"
            wrapperClassName=""
          >
            <Typography level="p5">
              {connectedWallet?.address
                ? truncateWallet(connectedWallet.address)
                : utils.string.formatAddressUsername(
                    profile?.profile_name || "unknown"
                  )}
            </Typography>
            <Typography level="p6" className="text-text-tertiary">
              {utils.formatUsdDigit(totalBalance)}
            </Typography>
          </AccordionTrigger>
          <AccordionContent className="!p-0">
            {mochiWallet || walletsWithBalance.length ? (
              [
                ...(mochiWallet ? [mochiWallet] : []),
                ...walletsWithBalance,
              ].map((w) => (
                <DropdownMenuItem
                  key={w.address}
                  leftIcon={<Avatar src={w.avatar || ""} size="xs" />}
                  rightExtra={
                    w.connectionStatus === "connected" ? (
                      <Typography level="p6" color="success">
                        Active
                      </Typography>
                    ) : undefined
                  }
                >
                  <Typography level="p5">
                    {truncateWallet(w.address)}
                  </Typography>
                  <Typography level="p6" className="text-text-tertiary">
                    {utils.formatUsdDigit(
                      formatUnits(
                        getUsdAmount(
                          w.flexibleStaking?.balance,
                          w.flexibleStaking?.price
                        )
                      )
                    )}
                  </Typography>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <Button
                  variant="soft"
                  className="w-full !justify-center"
                  onClick={onOpenLoginWidget}
                >
                  <WalletAddSolid />
                  Connect Wallet
                </Button>
              </DropdownMenuItem>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Link href={ROUTES.OVERVIEW_NFT(params.server)}>
        <DropdownMenuItem
          leftIcon={
            <Image src="/svg/image.svg" alt="" width={20} height={20} />
          }
        >
          NFT Earn
        </DropdownMenuItem>
      </Link>
      <DropdownMenuSeparator className="min-h-[1px]" />
      <DropdownMenuItem leftIcon={<LifeBuoySolid className="w-5 h-5" />}>
        Support
      </DropdownMenuItem>
      <DropdownMenuItem leftIcon={<X className="w-5 h-5" />}>
        Follow us
      </DropdownMenuItem>
      <DropdownMenuItem leftIcon={<Discord className="w-5 h-5" />}>
        Join Community
      </DropdownMenuItem>
      <DropdownMenuSeparator className="min-h-[1px]" />
      <DropdownMenuItem
        onClick={() => {
          resetFlexibleStaking();
          logout();
          push(ROUTES.HOME);
        }}
        leftIcon={
          <Image src="/svg/exit.svg" width={20} height={20} alt="disconnect" />
        }
      >
        Disconnect
      </DropdownMenuItem>
    </>
  );
};

export default function ProfileDropdown({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { isLoggedIn, profile, wallets } = useLoginWidget();
  const { initializeWallets, initializeMochiWallet } = useWalletBalance();

  let triggerRender = null;
  if (children) {
    triggerRender = children;
  } else {
    triggerRender =
      isLoggedIn && profile ? (
        <ProfileBadge
          avatar={profile?.avatar || "/logo.png"}
          name={
            utils.string.formatAddressUsername(profile.profile_name) ||
            "unknown"
          }
          platform=""
        />
      ) : null;
  }

  const initWallets = useRef(false);
  useEffect(() => {
    if (!isLoggedIn || initWallets.current) return;
    initWallets.current = true;
    initializeWallets(wallets);
  }, [initializeWallets, isLoggedIn, wallets]);

  useEffect(() => {
    if (!isLoggedIn) return;
    initializeMochiWallet({
      name: profile?.profile_name,
      id: profile?.id,
      avatar: profile?.avatar,
    });
  }, [
    initializeMochiWallet,
    isLoggedIn,
    profile?.avatar,
    profile?.id,
    profile?.profile_name,
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} asChild>
        {triggerRender}
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          wrapperClassName="z-[60]"
          className="overflow-y-auto w-screen flex flex-col rounded-none h-[calc(100svh-56px)] lg:m-0 lg:block lg:w-auto lg:h-auto lg:rounded-lg lg:max-h-[calc(100svh-100px)]"
          sideOffset={9}
          collisionPadding={{
            right: 32,
            bottom: 32,
          }}
        >
          <DropdownContent />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
