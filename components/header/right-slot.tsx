import { IconButton } from "@mochi-ui/core";
import { BellSolid } from "@mochi-ui/icons";
import { useLoginWidget } from "@mochi-web3/login-widget";
import { LoginPopover } from "../login-popover";
import ProfileDropdown from "../profile-dropdown";
import { NetworkButton } from "./network-button";

export const RightSlot = () => {
  const { isLoggedIn } = useLoginWidget();

  if (!isLoggedIn) {
    return <LoginPopover />;
  }

  return (
    <div className="flex items-center space-x-3">
      <NetworkButton />
      <IconButton
        label="notification"
        variant="outline"
        color="neutral"
        className="!p-1.5"
      >
        <BellSolid className="w-5 h-5" />
      </IconButton>
      <ProfileDropdown />
    </div>
  );
};
