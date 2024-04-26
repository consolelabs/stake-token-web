import { NftData } from "@/store/nft-staking";
import { Checkbox, Typography } from "@mochi-ui/core";
import clsx from "clsx";
import Image from "next/image";

interface Props {
  data: NftData;
  isSelecttionMode: boolean;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

export const StakedNFTCard = (props: Props) => {
  const { data, isSelecttionMode, isSelected, onSelect } = props;

  return (
    <div
      className={clsx(
        "rounded-xl border bg-background-surface cursor-pointer relative overflow-hidden p-4 space-y-2 hover:border-primary-solid",
        isSelected ? "border-primary-solid" : "border-divider",
        {
          "shadow-input-focused": isSelected && !isSelecttionMode,
        }
      )}
      onClick={() => onSelect(isSelected)}
    >
      <div className="flex space-x-2">
        <Image src="/nft/wood.png" alt="" width={80} height={80} />
        <div className="py-1">
          <Typography level="h6" fontWeight="lg">
            Firewood
          </Typography>
          <Typography level="p6">Dwarves #23</Typography>
        </div>
      </div>
      <div className="px-2 py-1">
        <div className="flex items-center justify-between space-x-0.5">
          <Typography level="p5" className="text-text-tertiary">
            Claimable Rewards
          </Typography>
          <div className="flex items-center space-x-1">
            <Image src="/ICY.png" alt="" width={20} height={20} />
            <Typography level="h9" color="primary">
              0.0000
            </Typography>
            <Typography level="h9">ICY</Typography>
          </div>
        </div>
        <Typography level="p6" className="text-text-tertiary">
          ≈ 0.00 USD
        </Typography>
      </div>
      <div className="py-2 flex items-center justify-between space-x-6">
        <div className="h-2 flex-1 relative bg-background-level2 rounded overflow-hidden">
          <div className="absolute left-0 h-full w-2/3 bg-primary-solid rounded" />
        </div>
        <div className="flex px-2">
          <Typography level="p5" color="primary">
            1
          </Typography>
          <Typography level="p5" className="text-text-tertiary">
            /7 days
          </Typography>
        </div>
      </div>
      {isSelecttionMode && (
        <Checkbox
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full"
          checked={isSelected}
        />
      )}
    </div>
  );
};
