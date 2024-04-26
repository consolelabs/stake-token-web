import { NftData } from "@/store/nft-staking";
import { Button, Checkbox, Typography } from "@mochi-ui/core";
import clsx from "clsx";
import Image from "next/image";

interface Props {
  data: NftData;
  isSelecttionMode: boolean;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

export const MyNFTCard = (props: Props) => {
  const { data, isSelecttionMode, isSelected, onSelect } = props;

  return (
    <div
      className={clsx(
        "rounded-lg border bg-background-surface cursor-pointer relative overflow-hidden group hover:border-primary-solid",
        isSelected ? "border-primary-solid" : "border-divider",
        {
          "shadow-input-focused": isSelected && !isSelecttionMode,
        }
      )}
      onClick={() => onSelect(isSelected)}
    >
      {!isSelecttionMode && (
        <div className="absolute inset-0 items-center justify-center bg-[rgba(35,36,38)] bg-opacity-20 hidden group-hover:flex">
          <Button>Stake</Button>
        </div>
      )}
      {isSelecttionMode && (
        <Checkbox
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full"
          checked={isSelected}
        />
      )}
      <div className="p-[3px] flex justify-center">
        <Image src={data.image || ""} alt="" width={120} height={120} />
      </div>
      <div className="px-1 pt-1 pb-2 text-center">
        <Typography level="h9">{data.name}</Typography>
        <Typography level="p6">
          {data.contractName} #{data.tokenId}
        </Typography>
      </div>
    </div>
  );
};
