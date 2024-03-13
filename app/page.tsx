"use client";

import { LoginPopover } from "@/components/login-popover";
import { Logo } from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";
import { TopBar } from "@mochi-ui/core";
import { useLoginWidget } from "@mochi-web3/login-widget";

export default function Home() {
  const { isLoggedIn } = useLoginWidget();

  return (
    <main>
      <TopBar
        leftSlot={<Logo />}
        rightSlot={!isLoggedIn ? <LoginPopover /> : <ProfileDropdown />}
      />
    </main>
  );
}
