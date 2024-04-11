"use client";

import { Suspense, useCallback, useState } from "react";
import { Header } from "@/components/header/header";
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  Typography,
} from "@mochi-ui/core";
import { useDisclosure } from "@dwarvesf/react-hooks";
import { LoginWidget } from "@mochi-web3/login-widget";
import { useSearchParams } from "next/navigation";
import { WretchError } from "wretch";
import { API } from "@/constants/api";

const Verify = () => {
  const { isOpen, onOpenChange } = useDisclosure();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, _setError] = useState("");
  const setError = useCallback(
    (e: WretchError) => {
      _setError(e.json?.msg ?? "Something went wrong");
    },
    [_setError]
  );

  const code = searchParams.get("code");
  const guild_id = searchParams.get("guild_id");

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
      <div className="py-8 px-8 mx-auto md:px-16 md:max-w-2xl min-h-[calc(100vh-56px)] flex flex-col items-center justify-center">
        <div className="text-2xl font-black text-center md:text-3xl">
          <span className="uppercase text-tono-gradient">
            Your wallet is verified! You can close this window
          </span>{" "}
          ✨
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <Typography
        level="h4"
        className="mb-4 text-center uppercase !font-black text-tono-gradient"
      >
        Verify your wallet
      </Typography>
      <Typography level="p3" className="mb-3 text-center max-w-md">
        Connect your wallet to verify and get full access to Tono with more
        exclusive privileges.
      </Typography>
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
                  if (!code || loading) return;
                  setLoading(true);
                  const payload = {
                    wallet_address: address,
                    code,
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
                    .badRequest(setError)
                    .json(async (r) => {
                      const user_discord_id = r.associated_accounts.find(
                        (aa: any) => aa.platform === "discord"
                      )?.platform_identifier;
                      if (!guild_id) {
                        setVerified(true);
                      } else if (user_discord_id) {
                        await API.MOCHI.post(
                          {
                            user_discord_id,
                            guild_id,
                          },
                          `/verify/assign-role`
                        )
                          .badRequest(setError)
                          .res(() => {
                            setVerified(true);
                          })
                          .catch(setError)
                          .finally(() => {
                            setLoading(false);
                            onOpenChange(false);
                          });
                      }
                    });
                }}
              />
            </ModalContent>
          </ModalPortal>
        </Modal>
        <Button color="primary" onClick={() => onOpenChange(true)}>
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
