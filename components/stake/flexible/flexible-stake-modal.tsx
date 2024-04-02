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
import { useEffect, useState } from "react";
import { FlexibleStakeContent } from "./flexible-stake-content";
import { FlexibleStakeResponse } from "./flexible-stake-response";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { ERC20TokenInteraction } from "@/services/contracts/Token";
import { PoolAddress, StakingPool } from "@/services/contracts/Pool";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FlexibleStakeModal = (props: Props) => {
  const { open, onOpenChange } = props;
  const [state, setState] = useState<"init" | "approved" | "success">("init");
  const [poolContract, setPoolContract] = useState<StakingPool>();
  const [icyContract, setIcyContract] = useState<ERC20TokenInteraction>();

  const {wallets, getProviderByAddress} = useLoginWidget();

  useEffect(() => {
    const getPoolContract = async () => {
      const connected = wallets.find(w => w.connectionStatus === "connected");
      if (!connected) {
        console.error("No wallet connected.");
        return
      }
      const address = connected?.address;
      const provider = getProviderByAddress(address || "");
      if (!provider) {
        console.error("No provider connected.");
        return
      }
      const pool = StakingPool.getInstance("ICY_ICY", provider);
      const icy = ERC20TokenInteraction.getInstance("ICY", provider)
      pool.setSenderAddress(address);
      icy.setSenderAddress(address);
      setPoolContract(pool);
      setIcyContract(icy);
    };
    getPoolContract();
  }, [getProviderByAddress, wallets]);

  const handleOnStake = async (amount: number) => {
    const tx = await poolContract?.stake(amount);
    if (!tx) {
      console.error("failed to stake");
      return;
    }
    console.log("pending stake tx_hash: ", tx);
    setState("success");
  }

  const handleOnApprove = async (isApproved: boolean) => {
    if (isApproved) {
      setState("approved");
      return;
    }
    const tx = await icyContract?.approveTokenAmount(PoolAddress.POOL_ICY_ICY, 1);
    if (!tx) {
      console.error("failed to approve allowance");
      return;
    }
    setState("approved");
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
          {state === "init" && (
            <ModalTitle className="relative pb-3">
              <Typography level="h6" fontWeight="lg" className="text-center">
                Stake ICY
              </Typography>
              <ModalClose className="absolute inset-y-0 right-0 h-fit">
                <CloseLgLine className="w-7 h-7" />
              </ModalClose>
            </ModalTitle>
          )}
          {state === "init" && (
            <FlexibleStakeContent
              onApprove={handleOnApprove}
              onStake={handleOnStake}
            />
          )}
          {state === "approved" && (
            <FlexibleStakeContent
              onApprove={handleOnApprove}
              onStake={handleOnStake}
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
