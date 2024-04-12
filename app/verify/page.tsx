"use client";

import { Suspense, useState } from "react";
import { Header } from "@/components/header/header";
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
} from "@mochi-ui/core";
import { useDisclosure } from "@dwarvesf/react-hooks";
import { LoginWidget } from "@mochi-web3/login-widget";
import { useSearchParams } from "next/navigation";
import { WretchError } from "wretch";
import { API } from "@/constants/api";
import { CheckCircleHalfColoredLine } from "@mochi-ui/icons";

const Verify = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const code = searchParams.get("code");
  const guild_id = searchParams.get("guild_id");
  const channel_id = searchParams.get("channel_id");
  const author_id = searchParams.get("author_id");
  const request_platform = searchParams.get("platform");
  const request_application = searchParams.get("application");

  if (error) {
    return (
      <div className="py-8 px-8 mx-auto md:px-16 md:max-w-2xl min-h-[calc(100vh-56px)] flex flex-col items-center justify-center">
        <div className="mb-2 font-medium text-center md:text-xl">
          Something went wrong with error
        </div>
        <div className="py-2 px-4 w-full font-mono rounded bg-stone-200">
          &ldquo;{error}&rdquo;
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <div className="rounded-full bg-success-plain-active w-24 h-24 flex items-center justify-center border-[16px] border-success-soft">
          <CheckCircleHalfColoredLine className="w-10 h-10 text-success-solid" />
        </div>
        <p className="text-2xl sm:text-3.5xl sm:leading-9 font-semibold text-text-primary">
          You have connected your wallet.
        </p>
        <p className="text-base sm:text-lg text-text-primary">
          Please close this window and go back to your Discord server.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <p className="text-2xl sm:text-3.5xl sm:leading-9 font-semibold text-text-primary">
        Verify your wallet
      </p>
      <p className="text-base sm:text-lg text-text-primary max-w-md">
        Connect your wallet to verify and get full access to Tono with more
        exclusive privileges.
      </p>
      <div>
        <Modal open={isOpen} onOpenChange={onOpenChange}>
          <ModalPortal>
            <ModalOverlay />
            <ModalContent
              className="p-3 w-full sm:w-auto"
              style={{
                maxWidth: "calc(100% - 32px)",
              }}
            >
              <LoginWidget
                raw
                onchain
                onWalletConnectSuccess={async ({
                  address,
                  signature,
                  platform,
                }) => {
                  if (loading) return;
                  setLoading(true);
                  const payload = {
                    code,
                    guild_id,
                    channel_id,
                    author_id,
                    request_platform,
                    request_application,
                    wallet_address: address,
                    signature,
                    message:
                      "Please sign this message to prove wallet ownership",
                  };

                  await API.MOCHI_PROFILE.post(
                    payload,
                    `/profiles/me/accounts/connect-${platform.replace(
                      "-chain",
                      ""
                    )}`
                  )
                    .res(() => {
                      setVerified(true);
                    })
                    .catch((e: WretchError) => {
                      setError(e.json?.msg ?? "Something went wrong");
                    })
                    .finally(() => {
                      setLoading(false);
                      onOpenChange(false);
                    });
                }}
              />
            </ModalContent>
          </ModalPortal>
        </Modal>
        <Button
          color="primary"
          onClick={() => {
            if (!code) {
              setError("code not found");
              return;
            }
            onOpen();
          }}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <Header />
      <Suspense>
        <Verify />
      </Suspense>
    </main>
  );
}
