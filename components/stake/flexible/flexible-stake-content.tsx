import { Button, Typography } from "@mochi-ui/core";
import { useEffect, useState } from "react";
import { TokenAmount } from "@/utils/number";
import { StakeInput } from "../stake-input";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { ERC20TokenInteraction } from "@/services/contracts/Token";
import { PoolAddress } from "@/services/contracts/Pool";

const flexibleAPR = 28.7;

interface Props {
  onStake: (amount: number) => Promise<void>;
  onApprove: (alreadyApproved: boolean) => Promise<void>; // remove boolean args later
}

export const FlexibleStakeContent = (props: Props) => {
  const { onStake, onApprove } = props;
  const [amount, setAmount] = useState<TokenAmount>({
    value: 0,
    display: "",
  });
  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(999999999);
  const {wallets, getProviderByAddress} = useLoginWidget();

  useEffect(() => {
    const fetchBalanceAndAllowance = async () => {
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
      const IcyToken = ERC20TokenInteraction.getInstance("ICY", provider);
      IcyToken.setSenderAddress(address);

      // get available staking token balance
      const balance = await IcyToken.getTokenBalance();
      if (!balance?.value) {
        console.error("Cannot get wallet balance.");
        return;
      }

      // get allowance for current pool
      await IcyToken.getAllowance(PoolAddress.POOL_ICY_ICY);
      // console.log("current allowance: ", fetchedAllowance);
      // if (!fetchedAllowance?.value) {
      //   console.error("Cannot get pool allowance.");
      //   return;
      // }
      // setAllowance(fetchedAllowance?.value);
      setBalance(balance?.value);
    };
    fetchBalanceAndAllowance();
  }, [getProviderByAddress, wallets]);

  return (
    <div className="flex flex-col">
      <div className="py-3 space-y-3">
        <div className="rounded-lg bg-primary-soft px-6 py-3 space-y-0.5">
          <div className="flex items-center justify-center text-center space-x-1">
            <Typography level="h6" fontWeight="xl" color="success">
              {flexibleAPR}%
            </Typography>
            <Typography level="h6" color="primary">
              Fixed ICY
            </Typography>
          </div>
          <Typography level="p5" color="primary" className="text-center">
            Withdraw anytime at market prices
          </Typography>
        </div>
        <StakeInput {...{ amount, setAmount, balance }} />
      </div>
      <Button
        size="lg"
        disabled={amount.value <= 0 || amount.value > balance}
        className="mt-3"
        onClick={
          allowance >= amount.value ? 
          () => onStake(amount.value) : 
          () => onApprove(true)
        }
      >
        {amount.value > balance ? "Insufficient balance" : "Stake"}
      </Button>
    </div>
  );
};
