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
import { useFlexibleStaking } from "@/store/flexible-staking";
import { FlexibleUnstakeContent } from "./flexible-unstake-content";
import { FlexibleUnstakeResponse } from "./flexible-unstake-response";
import { FlexibleUnstakePreview } from "./flexible-unstake-preview";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FlexibleUnstakeModal = (props: Props) => {
  const { open, onOpenChange } = props;
  const { stakingToken } = useFlexibleStaking();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [state, setState] = useState<"init" | "preview" | "success">("init");

  const onConfirm = () => {
    setState("preview");
  };

  const onSuccess = () => {
    setState("success");
  };

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
        <ModalContent
          className="w-full max-w-[530px] overflow-clip"
          ref={(ref) => {
            if (ref && ref !== container) {
              setContainer(ref);
            }
          }}
        >
          {state === "init" && (
            <ModalTitle className="relative pb-3">
              <Typography level="h6" fontWeight="lg" className="text-center">
                Unstake {stakingToken?.token_symbol}
              </Typography>
              <ModalClose className="absolute inset-y-0 right-0 h-fit">
                <CloseLgLine className="w-7 h-7" />
              </ModalClose>
            </ModalTitle>
          )}
          {state === "init" && (
            <FlexibleUnstakeContent {...{ container, onConfirm }} />
          )}
          {state === "preview" && <FlexibleUnstakePreview {...{ onSuccess }} />}
          {state === "success" && (
            <FlexibleUnstakeResponse
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
