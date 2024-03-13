import {
  Button,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@mochi-ui/core";
import { useLoginWidget } from "@mochi-web3/login-widget";
import dynamic from "next/dynamic";
import { useState } from "react";

const LoginWidget = dynamic(() =>
  import("@mochi-web3/login-widget").then((m) => m.LoginWidget)
);

export const LoginPopover = () => {
  const { isLoadingProfile } = useLoginWidget();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger
        className="text-left"
        asChild
        // wrap Button by div to prevent event loss when use `asChild` props
      >
        <div>
          <Button className="justify-center w-20" loading={isLoadingProfile}>
            Login
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="!p-3" sideOffset={10} collisionPadding={20}>
          <LoginWidget onClose={() => setIsOpen(false)} raw />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};
