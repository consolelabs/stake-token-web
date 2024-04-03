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
import { useCallback, useEffect, useRef, useState } from "react";
import { FlexibleStakeContent } from "./flexible-stake-content";
import { FlexibleStakeResponse } from "./flexible-stake-response";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { ERC20TokenInteraction } from "@/services/contracts/Token";
import { PoolAddress, StakingPool } from "@/services/contracts/Pool";
import { ChainProvider } from "@mochi-web3/connect-wallet-widget";
import { useFlexibleStaking } from "@/store/flexibleStaking";
import { retry } from "@/utils/retry";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FlexibleStakeModal = (props: Props) => {
  const { open, onOpenChange } = props;
  const { wallets, getProviderByAddress, isLoggingIn, isLoggedIn } =
    useLoginWidget();
  const { poolContract, icyContract, allowance, stakedAmount, setValues } =
    useFlexibleStaking();
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"init" | "approved" | "success">("init");
  const [loading, setLoading] = useState<
    "Initializing" | "Approving" | "Staking" | null
  >(null);

  const connected = wallets.find((w) => w.connectionStatus === "connected");
  const address = connected?.address || "";

  const updateValues = useCallback(async () => {
    if (!poolContract || !icyContract) return;
    const [
      getBalance,
      getAllowance,
      getApr,
      getStakedAmount,
      getPoolStakedAmount,
      getEarnedRewards,
    ] = await Promise.allSettled([
      icyContract.getTokenBalance(),
      icyContract.getAllowance(PoolAddress.POOL_ICY_ICY),
      poolContract.calculateRealtimeAPR(),
      poolContract.getSenderStakedAmount(),
      poolContract.getPoolTotalStakedAmount(),
      poolContract.getTotalRewardEarnedForAddress(),
    ]);
    const apr = getApr.status === "fulfilled" ? getApr.value || 0 : 0;
    const balance =
      getBalance.status === "fulfilled" ? getBalance.value?.value || 0 : 0;
    const allowance =
      getAllowance.status === "fulfilled" ? getAllowance.value?.value || 0 : 0;
    const stakedAmount =
      getStakedAmount.status === "fulfilled"
        ? getStakedAmount.value?.value || 0
        : 0;
    const poolStakedAmount =
      getPoolStakedAmount.status === "fulfilled"
        ? getPoolStakedAmount.value?.value || 0
        : 0;
    const earnedRewards =
      getEarnedRewards.status === "fulfilled"
        ? getEarnedRewards.value?.value || 0
        : 0;
    setValues({
      apr,
      balance,
      allowance,
      stakedAmount,
      poolStakedAmount,
      earnedRewards,
    });
  }, [icyContract, poolContract, setValues]);

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
        const poolContract = StakingPool.getInstance("ICY_ICY", provider);
        const icyContract = ERC20TokenInteraction.getInstance("ICY", provider);
        poolContract.setSenderAddress(address);
        icyContract.setSenderAddress(address);
        setValues({ poolContract, icyContract });

        await updateValues();
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
  }, [address, getProviderByAddress, setValues, updateValues]);

  const onStake = async (amount: number) => {
    if (!poolContract) return;
    try {
      setLoading("Staking");
      const tx = await poolContract.stake(amount);
      if (!tx) {
        throw new Error("Failed to stake");
      }
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
    if (!icyContract) return;
    try {
      setLoading("Approving");
      const tx = await icyContract.approveTokenAmount(
        PoolAddress.POOL_ICY_ICY,
        amount
      );
      if (!tx) {
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
          className="w-full max-w-[530px] overflow-hidden"
          ref={ref}
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
              {...{ onApprove, onStake, loading }}
              connected={isLoggedIn && !!connected}
              container={ref.current}
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
