import {
  Modal,
  ModalClose,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  Typography,
  toast,
} from "@mochi-ui/core";
import { CloseLgLine } from "@mochi-ui/icons";
import { useEffect, useState } from "react";
import { FlexibleStakeContent } from "./flexible-stake-content";
import { FlexibleStakeResponse } from "./flexible-stake-response";
import { ChainProvider, useLoginWidget } from "@mochi-web3/login-widget";
import { PoolAddress } from "@/services/contracts/Pool";
import { useFlexibleStaking } from "@/store/flexible-staking";
import { retry } from "@/utils/retry";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FlexibleStakeModal = (props: Props) => {
  const { open, onOpenChange } = props;
  const { wallets, getProviderByAddress } = useLoginWidget();
  const {
    poolContract,
    icyContract,
    allowance,
    stakedAmount,
    initializeValues,
    initializeContract,
    updateValues,
    setValues,
  } = useFlexibleStaking();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [state, setState] = useState<"init" | "approved" | "success">("init");
  const [loading, setLoading] = useState<
    "Initializing" | "Approving" | "Staking" | null
  >(null);

  const connected = wallets.find((w) => w.connectionStatus === "connected");
  const address = connected?.address || "";

  useEffect(() => {
    if (!!address) return;
    initializeValues();
  }, [address, initializeValues]);

  useEffect(() => {
    if (!address) return;
    const init = async () => {
      try {
        const provider = getProviderByAddress(address) as ChainProvider | null;
        if (!provider) {
          throw new Error("No provider connected.");
        }
        setLoading("Initializing");
        initializeContract(address, provider);
        await updateValues();
      } catch (err: any) {
        toast({
          scheme: "danger",
          title: "Error",
          description:
            typeof err.message === "string"
              ? err.message
              : "Failed to initialize contract interaction",
        });
      } finally {
        setLoading(null);
      }
    };
    init();
  }, [address, getProviderByAddress, initializeContract, updateValues]);

  const onStake = async (amount: number) => {
    if (!poolContract) return;
    try {
      setLoading("Staking");
      const txHash = await poolContract.stake(amount);
      if (!txHash) {
        throw new Error("Failed to stake");
      }
      setValues({ latestStaking: { txHash, amount } });
      // FIXME: retry to get updated values
      const newStakedAmount = await retry(
        async () => {
          const newStakedAmount = await poolContract.getSenderStakedAmount();
          if (newStakedAmount?.value !== stakedAmount) {
            return newStakedAmount?.value;
          } else {
            throw new Error("Staked amount not updated");
          }
        },
        3000,
        100
      );
      if (!newStakedAmount) {
        throw new Error("Failed to get updated values");
      }
      await updateValues();
      setState("success");
    } catch (err: any) {
      toast({
        scheme: "danger",
        title: "Error",
        description:
          typeof err.message === "string" ? err.message : "Failed to stake",
      });
    } finally {
      setLoading(null);
    }
  };

  const onApprove = async (amount: number) => {
    if (!icyContract) return;
    try {
      setLoading("Approving");
      const txHash = await icyContract.approveTokenAmount(
        PoolAddress.POOL_ICY_ICY,
        amount
      );
      if (!txHash) {
        throw new Error("Failed to approve allowance");
      }
      // FIXME: retry to get updated values
      const newAllowance = await retry(
        async () => {
          const newAllowance = await icyContract.getAllowance(
            PoolAddress.POOL_ICY_ICY
          );
          if (newAllowance?.value !== allowance) {
            return newAllowance?.value;
          } else {
            throw new Error("Allowance not updated");
          }
        },
        3000,
        100
      );
      if (!newAllowance) {
        throw new Error("Failed to get updated values");
      }
      await updateValues();
      setState("approved");
    } catch (err: any) {
      toast({
        scheme: "danger",
        title: "Error",
        description:
          typeof err.message === "string"
            ? err.message
            : "Failed to approve allowance",
      });
    } finally {
      setLoading(null);
    }
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
            if (ref && !container) {
              setContainer(ref);
            }
          }}
        >
          {(state === "init" || state === "approved") && (
            <ModalTitle className="relative pb-3">
              <Typography level="h6" fontWeight="lg" className="text-center">
                Stake ICY
              </Typography>
              <ModalClose className="absolute inset-y-0 right-0 h-fit">
                <CloseLgLine className="w-7 h-7" />
              </ModalClose>
            </ModalTitle>
          )}
          {(state === "init" || state === "approved") && (
            <FlexibleStakeContent
              {...{ onApprove, onStake, loading, container }}
            />
          )}
          {state === "success" && (
            <FlexibleStakeResponse
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
