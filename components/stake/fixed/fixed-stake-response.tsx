import {
  Button,
  ModalClose,
  Switch,
  Tooltip,
  Typography,
} from "@mochi-ui/core";
import { CheckCircleHalfColoredLine, CheckLine } from "@mochi-ui/icons";
import Image from "next/image";

interface Props {
  onClose: () => void;
}

export const FixedStakeResponse = (props: Props) => {
  const { onClose } = props;

  return (
    <>
      <div className="space-y-5">
        <div className="rounded-full bg-success-plain-active w-24 h-24 flex items-center justify-center border-[16px] border-success-soft mx-auto">
          <CheckCircleHalfColoredLine className="w-10 h-10 text-success-solid" />
        </div>
        <Typography level="h6" fontWeight="lg" className="text-center">
          Stake Successful
        </Typography>
        <div className="flex items-center justify-between">
          <Typography level="p4" className="text-text-tertiary">
            You’re staking
          </Typography>
          <div className="flex items-center space-x-1">
            <Image src="/ICY.png" alt="icy" width={24} height={24} />
            <Typography level="h7" fontWeight="lg">
              2,000 ICY
            </Typography>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-soft-active bg-background-level1 p-4 space-y-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center bg-black rounded-full border border-black">
                <CheckLine className="w-4 h-4 text-white" />
              </div>
              <Typography level="h9">Stake date</Typography>
            </div>
            <Typography level="p5">08/03/2024 17:05</Typography>
          </div>
          <div className="flex items-center justify-between relative">
            <div className="absolute -top-7 left-3 -translate-x-1/2 h-7 border-r border-neutral-soft-active" />
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-solid">
                <Typography className="text-xs font-semibold">2</Typography>
              </div>
              <Typography level="h9">Value date</Typography>
            </div>
            <Typography level="p5">08/03/2024 07:00</Typography>
          </div>
          <div className="flex items-center justify-between relative">
            <div className="absolute -top-7 left-3 -translate-x-1/2 h-7 border-r border-neutral-soft-active" />
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-solid-disable-fg">
                <Typography className="text-xs font-semibold">3</Typography>
              </div>
              <Typography level="h9">Interest end date</Typography>
            </div>
            <Typography level="p5">08/03/2025 07:00</Typography>
          </div>
          <div className="flex items-center justify-between relative">
            <div className="absolute -top-7 left-3 -translate-x-1/2 h-7 border-r border-neutral-soft-active" />
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-solid-disable-fg">
                <Typography className="text-xs font-semibold">4</Typography>
              </div>
              <Typography level="h9">Next staking date</Typography>
            </div>
            <Typography level="p5">08/03/2025 07:00</Typography>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip
            content="Auto-Staking automates the process of topping up your margin wallet, saving you from manually transferring funds before each trade. This is especially useful if you plan on making frequent trades."
            className="max-w-xs text-center z-50"
            arrow="bottom-center"
          >
            <Switch />
          </Tooltip>
          <Typography level="p5">Auto-Staking</Typography>
          <Typography level="p5" className="text-text-tertiary">
            Potential for profit maximization
          </Typography>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Button size="lg" variant="outline" color="neutral" onClick={onClose}>
          Close
        </Button>
        <Button size="lg" onClick={onClose}>
          View My Earn
        </Button>
      </div>
    </>
  );
};
