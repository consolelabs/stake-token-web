"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header/header";
import { Suspense, useEffect } from "react";
import { useServerInfo } from "@/store/server-info";
import Image from "next/image";
import { Button, Typography } from "@mochi-ui/core";
import { PlusLine, VaultSolid } from "@mochi-ui/icons";
import { Highlights } from "@/components/overview/highlights";

const Overview = () => {
  const { abort, getInfo } = useServerInfo();

  useEffect(() => {
    getInfo();
    return abort;
  }, [abort, getInfo]);

  return (
    <div
      className="overflow-y-auto h-[calc(100vh-56px)] flex flex-col"
      style={{ background: "#f4f5f6" }}
    >
      <div className="flex relative flex-col px-40 pt-14 pb-36 bg-black">
        <img
          src="/tree.png"
          alt=""
          className="absolute top-1/2 left-3/4 h-full -translate-y-1/2 scale-[0.9]"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
        <div className="flex relative flex-col gap-y-2.5 w-[650px]">
          <div className="flex gap-x-2 items-center">
            <Image width={32} height={32} src="/verified-badge.png" alt="" />
            <Typography level="h4" className="font-semibold text-white">
              Dwarves Guild
            </Typography>
          </div>
          <Typography level="p" className="text-white">
            A software development firm based in Asia. Helping tech startups,
            entrepreneurs build and scale world-class products since 2013.
          </Typography>
          <div className="flex gap-x-2 items-center -ml-1.5">
            <div className="flex gap-x-1.5 items-center py-0.5 px-1.5">
              <div className="w-2 h-2 rounded-full bg-success-solid" />
              <Typography level="p6" className="font-semibold text-white">
                97,118 Online
              </Typography>
            </div>

            <div className="flex gap-x-1.5 items-center py-0.5 px-1.5">
              <div className="w-2 h-2 rounded-full bg-neutral-outline-border" />
              <Typography level="p6" className="font-semibold text-white">
                2,301,743 Members
              </Typography>
            </div>

            <Typography
              level="p6"
              color="textDisabled"
              className="font-semibold"
            >
              Joined 2021 Dec
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex relative flex-col px-40">
        <div className="flex justify-between items-end -mt-[66px]">
          <div className="overflow-hidden p-1 bg-[#f4f5f6] rounded-full">
            <Image
              width={132}
              height={132}
              src="/dwarves-guild-logo.png"
              alt=""
            />
          </div>
          <div className="flex gap-x-2 mb-4">
            <Button variant="link" color="neutral">
              Share
            </Button>
            <Button variant="outline" color="neutral">
              <VaultSolid />
              Stake
            </Button>
            <Button>
              <PlusLine />
              Join Server
            </Button>
          </div>
        </div>
        <div className="flex flex-col pt-6 pb-10">
          <Highlights />
        </div>
        {/* <About /> */}
        {/* <InfoGrid /> */}
        {/* <BountyTable /> */}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <Header />
      <Suspense>
        <Overview />
      </Suspense>
    </main>
  );
}
