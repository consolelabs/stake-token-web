import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  ProfileBadge,
  Typography,
  DropdownMenuLabel,
  DropdownMenuPortal,
} from "@mochi-ui/core";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { ReactNode } from "react";
import { version as appVersion } from "../package.json";
import { utils } from "@consolelabs/mochi-formatter";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ProfileDropdown({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { isLoggedIn, profile, logout } = useLoginWidget();
  const { push } = useRouter();

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
          <DropdownMenuItem
            hasPaddingLeft
            onClick={() => {
              logout();
              push(ROUTES.HOME);
            }}
          >
            Logout
          </DropdownMenuItem>
          <DropdownMenuSeparator className="hidden lg:flex" />
          <DropdownMenuSeparator className="lg:hidden !mt-auto" />
          <DropdownMenuLabel className="flex flex-col">
            <Typography level="p6" color="textDisabled" fontWeight="sm">
              Powered by Console Labs
            </Typography>
            <Typography level="p6" color="textDisabled" fontWeight="sm">
              Version {appVersion}
            </Typography>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
