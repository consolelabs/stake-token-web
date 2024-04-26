import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@mochi-ui/core";
import { StakedNFTCard } from "./staked-nft-card";
import { useState } from "react";
import { NftData } from "@/store/nft-staking";
import { NFTTabContent } from "./nft-tab-content";

interface Props {
  loading: boolean;
  isSelecttionMode: boolean;
  previewIndex: number;
  setPreviewIndex: (index: number) => void;
  selectedIndexes: number[];
  setSelectedIndexes: (indexes: number[]) => void;
}

export const StakedNFTTab = (props: Props) => {
  const {
    loading,
    isSelecttionMode,
    previewIndex,
    setPreviewIndex,
    selectedIndexes,
    setSelectedIndexes,
  } = props;
  const stakedNftData: NftData[] = [];
  const [width, setWidth] = useState(0);

  return (
    <NFTTabContent
      loading={loading}
      empty={!stakedNftData.length}
      className="md:absolute inset-0"
    >
      <ScrollArea className="h-full">
        <ScrollAreaViewport>
          <div
            ref={(ref) => {
              if (ref) setWidth(ref.offsetWidth);
            }}
            className="grid gap-2 justify-evenly p-2"
            style={{
              gridTemplateColumns: `repeat(${Math.floor(
                (width - 8) / (300 + 8)
              )}, 1fr)`,
            }}
          >
            {stakedNftData.map((data, index) => (
              <StakedNFTCard
                key={data.tokenId}
                data={data}
                isSelecttionMode={isSelecttionMode}
                isSelected={
                  isSelecttionMode
                    ? selectedIndexes.includes(index)
                    : previewIndex === index
                }
                onSelect={(isSelect) => {
                  if (
                    isSelecttionMode &&
                    isSelect &&
                    selectedIndexes.length > 1
                  ) {
                    const newIndexes = selectedIndexes.filter(
                      (item) => item !== index
                    );
                    setSelectedIndexes(newIndexes);
                    setPreviewIndex(newIndexes[newIndexes.length - 1]);
                  } else if (isSelecttionMode && !isSelect) {
                    setSelectedIndexes([...selectedIndexes, index]);
                    setPreviewIndex(index);
                  } else if (!isSelecttionMode) {
                    setPreviewIndex(index);
                  }
                }}
              />
            ))}
          </div>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar>
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
      </ScrollArea>
    </NFTTabContent>
  );
};
