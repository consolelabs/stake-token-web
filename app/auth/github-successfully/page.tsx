"use client";

import { LoginPopover } from "@/components/login-popover";
import { Logo } from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";
import { TopBar, Typography } from "@mochi-ui/core";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { CheckCircleHalfColoredLine } from "@mochi-ui/icons";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const Auth = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="rounded-full bg-success-plain-active w-24 h-24 flex items-center justify-center border-[16px] border-success-soft">
        <CheckCircleHalfColoredLine className="w-10 h-10 text-success-solid" />
      </div>
      <p className="text-2xl sm:text-3.5xl sm:leading-9 font-semibold text-text-primary">
        You&apos;re already logged in.
      </p>
      <p className="text-base sm:text-lg text-text-primary">
        Continue setting up Tono Bot for your community by going back to your
        Discord server.
      </p>
    </div>
  );
};

export default function Page() {
  const { isLoggedIn } = useLoginWidget();

  return (
    <main>
      <TopBar
        leftSlot={<Logo />}
        rightSlot={!isLoggedIn ? <LoginPopover /> : <ProfileDropdown />}
      />
      <Suspense>
        <Auth />
      </Suspense>
    </main>
  );
}
