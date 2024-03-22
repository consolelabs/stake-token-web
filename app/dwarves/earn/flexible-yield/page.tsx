"use client";

import { LoginPopover } from "@/components/login-popover";
import { Logo } from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";
import { Stake } from "@/components/stake";
import { TopBar } from "@mochi-ui/core";
import { LoginWidget, useLoginWidget } from "@mochi-web3/login-widget";
import { Suspense } from "react";

export default function Page() {
  const { isLoggedIn, isLoggingIn } = useLoginWidget();

  return (
    <main>
      <TopBar
        leftSlot={<Logo />}
        rightSlot={!isLoggedIn ? <LoginPopover /> : <ProfileDropdown />}
      />
      {isLoggedIn ? (
        <Suspense>
          <Stake type="flexible" />
        </Suspense>
      ) : (
        <div className="flex items-center justify-center flex-1 w-full !min-h-[calc(100vh-56px)] bg-background-backdrop">
          {!isLoggingIn && (
            <div className="p-3 rounded-lg shadow-md bg-background-popup">
              <LoginWidget raw />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
