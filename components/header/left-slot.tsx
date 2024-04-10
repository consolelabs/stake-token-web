import { Button, Typography } from "@mochi-ui/core";
import { Logo } from "../logo";
import { DocumentStarSolid, SwapCircleSolid } from "@mochi-ui/icons";

export const LeftSlot = () => {
  return (
    <div className="flex items-center">
      <Logo />
      <Button variant="link" color="neutral" className="ml-7">
        <SwapCircleSolid className="w-4 h-4 text-text-icon-secondary" />
        <Typography level="p8">Swap</Typography>
      </Button>
      <Button variant="link" color="neutral">
        <DocumentStarSolid className="w-4 h-4 text-text-icon-secondary" />
        <Typography level="p8">Take a look around</Typography>
      </Button>
    </div>
  );
};
