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
import { LoginWidget, useLoginWidget } from "@mochi-web3/login-widget";
import { ERC20TokenInteraction } from "@/services/contracts/Token";
import { PoolAddress, StakingPool } from "@/services/contracts/Pool";
import { ChainProvider } from "@mochi-web3/connect-wallet-widget";
import { useFlexibleStaking } from "@/store/flexibleStaking";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FlexibleStakeModal = (props: Props) => {
  const { open, onOpenChange } = props;
  const { wallets, getProviderByAddress, isLoggingIn, isLoggedIn } =
    useLoginWidget();
  const { poolContract, icyContract, setValues } = useFlexibleStaking();
  const [state, setState] = useState<"init" | "approved" | "success">("init");
  const [loading, setLoading] = useState<
    "Initializing" | "Approving" | "Staking" | null
  >(null);

  const connected = wallets.find((w) => w.connectionStatus === "connected");
  const address = connected?.address || "";
  useEffect(() => {
    if (!address) return;
    const provider = getProviderByAddress(address) as ChainProvider | null;
    if (!provider) {
      toast({
        scheme: "danger",
        title: "Error",
        description: "No provider connected.",
      });
      return;
    }

    const initializeContractInteraction = async () => {
      try {
        setLoading("Initializing");
        const pool = StakingPool.getInstance("ICY_ICY", provider);
        const icy = ERC20TokenInteraction.getInstance("ICY", provider);
        pool.setSenderAddress(address);
        icy.setSenderAddress(address);
        setValues({ poolContract: pool, icyContract: icy });

        const result = await Promise.allSettled([
          pool.calculateRealtimeAPR(),
          icy.getTokenBalance(),
          icy.getAllowance(PoolAddress.POOL_ICY_ICY),
        ]);
        const aprPercentage =
          result[0].status === "fulfilled" ? result[0].value : 0;
        const balance =
          result[1].status === "fulfilled"
            ? result[1].value
            : { value: 0, display: "" };
        const allowance =
          result[2].status === "fulfilled"
            ? result[2].value
            : { value: 0, display: "" };
        setValues({ aprPercentage, balance, allowance });
      } catch (err) {
        toast({
          scheme: "danger",
          title: "Error",
          description: "Failed to initialize contract interaction",
        });
      } finally {
        setLoading(null);
      }
    };
    initializeContractInteraction();
  }, [address, getProviderByAddress, setValues]);

  const onStake = async (amount: number) => {
    try {
      setLoading("Staking");
      const tx = await poolContract?.stake(amount);
      if (!tx) {
        throw new Error("Failed to stake");
      }
      setState("success");
    } catch (err) {
      toast({
        scheme: "danger",
        title: "Error",
        description: "Failed to stake",
      });
    } finally {
      setLoading(null);
    }
  };

  const onApprove = async (amount: number) => {
    try {
      setLoading("Approving");
      const tx = await icyContract?.approveTokenAmount(
        PoolAddress.POOL_ICY_ICY,
        amount
      );
      if (!tx) {
        throw new Error("Failed to approve allowance");
      }
      setState("approved");
    } catch (err) {
      toast({
        scheme: "danger",
        title: "Error",
        description: "Failed to approve allowance",
      });
    } finally {
      setLoading(null);
    }
  };

  if (isLoggingIn) {
    return null;
  }

  if (!isLoggedIn || !connected) {
    return (
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalPortal>
          <ModalOverlay />
          <ModalContent className="w-full max-w-[530px]">
            <LoginWidget raw onchain chain="evm" />
          </ModalContent>
        </ModalPortal>
      </Modal>
    );
  }

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
            <FlexibleStakeContent {...{ onApprove, onStake, loading }} />
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
