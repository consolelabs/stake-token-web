import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  ProfileBadge,
  DropdownMenuPortal,
  Button,
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalTrigger,
  Avatar,
  Typography,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@mochi-ui/core";
import { LoginWidget, useLoginWidget } from "@mochi-web3/login-widget";
import { ReactNode, useEffect } from "react";
import { utils } from "@consolelabs/mochi-formatter";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useFlexibleStaking } from "@/store/flexible-staking";
import Image from "next/image";
import {
  Discord,
  LifeBuoySolid,
  WalletAddSolid,
  WalletSolid,
  X,
} from "@mochi-ui/icons";
import { useWallet } from "@/store/wallet";
import { truncateWallet } from "@/utils/string";
import { formatUnits } from "ethers/lib/utils";
import { constants } from "ethers";

export default function ProfileDropdown({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { isLoggedIn, profile, wallets, logout } = useLoginWidget();
  const { push } = useRouter();
  const { reset: resetFlexibleStaking } = useFlexibleStaking();

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

  const { walletsWithBalance, getConnectedWallet, initializeWallets } =
    useWallet();
  const connectedWallet = getConnectedWallet();

  useEffect(() => {
    if (!wallets.length) return;
    initializeWallets(wallets);
  }, [initializeWallets, wallets]);

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
          <Accordion
            type="single"
            collapsible
            defaultValue="profile"
            className="!p-0 shadow-none"
          >
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
                  {utils.formatUsdDigit(
                    formatUnits(connectedWallet?.balance || constants.Zero)
                  )}
                </Typography>
              </AccordionTrigger>
              <AccordionContent>
                {connectedWallet ? (
                  walletsWithBalance.map((w) => (
                    <DropdownMenuItem
                      key={w.address}
                      leftIcon={<Avatar src="" size="xs" />}
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
                          formatUnits(w.balance || constants.Zero)
                        )}
                      </Typography>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem asChild>
                    <Modal>
                      <ModalTrigger asChild>
                        <Button
                          variant="soft"
                          className="w-full !justify-center"
                        >
                          <WalletAddSolid />
                          Connect Wallet
                        </Button>
                      </ModalTrigger>
                      <ModalPortal>
                        <ModalOverlay />
                        <ModalContent>
                          <LoginWidget raw onchain chain="evm" />
                        </ModalContent>
                      </ModalPortal>
                    </Modal>
                  </DropdownMenuItem>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* <DropdownMenuItem leftIcon={<Avatar src="" />}>
            <Typography level="p5">
              {connectedWallet?.address
                ? truncateWallet(connectedWallet.address)
                : utils.string.formatAddressUsername(
                    profile?.profile_name || "unknown"
                  )}
            </Typography>
            <Typography level="p6" className="text-text-tertiary">
              {utils.formatUsdDigit(
                formatUnits(connectedWallet?.balance || constants.Zero)
              )}
            </Typography>
          </DropdownMenuItem> */}
          {/* {connectedWallet ? (
            walletsWithBalance.map((w) => (
              <DropdownMenuItem
                key={w.address}
                leftIcon={<Avatar src="" size="xs" />}
                rightExtra={
                  w.connectionStatus === "connected" ? (
                    <Typography level="p6" color="success">
                      Active
                    </Typography>
                  ) : undefined
                }
              >
                <Typography level="p5">{truncateWallet(w.address)}</Typography>
                <Typography level="p6" className="text-text-tertiary">
                  {utils.formatUsdDigit(
                    formatUnits(w.balance || constants.Zero)
                  )}
                </Typography>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem asChild>
              <Modal>
                <ModalTrigger asChild>
                  <Button variant="soft" className="w-full !justify-center">
                    <WalletAddSolid />
                    Connect Wallet
                  </Button>
                </ModalTrigger>
                <ModalPortal>
                  <ModalOverlay />
                  <ModalContent>
                    <LoginWidget raw onchain chain="evm" />
                  </ModalContent>
                </ModalPortal>
              </Modal>
            </DropdownMenuItem>
          )} */}
          <DropdownMenuItem leftIcon={<WalletSolid className="w-5 h-5" />}>
            My Earn
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem leftIcon={<LifeBuoySolid className="w-5 h-5" />}>
            Support
          </DropdownMenuItem>
          <DropdownMenuItem leftIcon={<X className="w-5 h-5" />}>
            Follow us
          </DropdownMenuItem>
          <DropdownMenuItem leftIcon={<Discord className="w-5 h-5" />}>
            Join Community
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              resetFlexibleStaking();
              logout();
              push(ROUTES.HOME);
            }}
            leftIcon={
              <Image
                src="/svg/exit.svg"
                width={20}
                height={20}
                alt="disconnect"
              />
            }
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
