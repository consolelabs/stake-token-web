import {
  Modal,
  ModalClose,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  Typography,
} from "@mochi-ui/core";
import { CloseLgLine } from "@mochi-ui/icons";
import { useState } from "react";
import { FixedStakeContent } from "./fixed-stake-content";
import { FixedStakeResponse } from "./fixed-stake-response";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FixedStakeModal = (props: Props) => {
  const { open, onOpenChange } = props;
  const [state, setState] = useState<"init" | "success">("init");

  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setState("init");
        }
      }}
    >
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="w-full max-w-[530px]">
          {state === "init" && (
            <ModalTitle className="relative pb-3">
              <Typography level="h6" fontWeight="lg" className="text-center">
                Stake DFG
              </Typography>
              <ModalClose className="absolute inset-y-0 right-0 h-fit">
                <CloseLgLine className="w-7 h-7" />
              </ModalClose>
            </ModalTitle>
          )}
          {state === "init" && (
            <FixedStakeContent
              onStake={() => {
                setState("success");
              }}
            />
          )}
          {state === "success" && (
            <FixedStakeResponse
              onClose={() => {
                onOpenChange(false);
                setTimeout(() => {
                  setState("init");
                }, 300);
              }}
            />
          )}
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};
