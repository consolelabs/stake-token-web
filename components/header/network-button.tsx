import { Button } from "@mochi-ui/core";
import { ChevronDownLine } from "@mochi-ui/icons";
import { TokenImage } from "../token-image";
import { useWalletNetwork } from "@/hooks/useWalletNetwork";
import { BASE_PROVIDER_RPC } from "@/envs";

export const NetworkButton = () => {
  const { isConnected, isCorrectNetwork, changeNetwork } = useWalletNetwork({
    chain: {
      id: 84532,
      name: "Base",
      rpc: BASE_PROVIDER_RPC,
      currency: "ETH",
    },
  });

  if (!isConnected) return null;

  return isCorrectNetwork ? (
    <Button variant="link" color="neutral" size="sm">
      <TokenImage symbol="base" size={22} />
      Base
      <ChevronDownLine className="w-4 h-4 text-text-icon-secondary" />
    </Button>
  ) : (
    <Button variant="link" color="neutral" size="sm" onClick={changeNetwork}>
      Switch to Base
      <ChevronDownLine className="w-4 h-4 text-text-icon-secondary" />
    </Button>
  );
};
