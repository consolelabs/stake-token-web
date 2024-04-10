"use client";

import { CheckCircleHalfColoredLine } from "@mochi-ui/icons";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header/header";

const Auth = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="rounded-full bg-success-plain-active w-24 h-24 flex items-center justify-center border-[16px] border-success-soft">
        <CheckCircleHalfColoredLine className="w-10 h-10 text-success-solid" />
      </div>
      <p className="text-2xl sm:text-3.5xl sm:leading-9 font-semibold text-text-primary">
        You&apos;re logged in.
      </p>
      <p className="text-base sm:text-lg text-text-primary">
        You can safely turn off this page
      </p>
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <Header />
      <Suspense>
        <Auth />
      </Suspense>
    </main>
  );
}
