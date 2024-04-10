import { TopBar } from "@mochi-ui/core";
import { LeftSlot } from "./left-slot";
import { RightSlot } from "./right-slot";

export const Header = () => {
  return <TopBar leftSlot={<LeftSlot />} rightSlot={<RightSlot />} />;
};
