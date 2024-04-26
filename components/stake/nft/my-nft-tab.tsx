import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@mochi-ui/core";
import { MyNFTCard } from "./my-nft-card";
import { useEffect, useState } from "react";
import { useNFTStaking } from "@/store/nft-staking";
import { NFTTabContent } from "./nft-tab-content";
import { useConnectedWallet } from "@/store/connected-wallet";

interface Props {
  loading: boolean;
  isSelecttionMode: boolean;
  previewIndex: number;
  setPreviewIndex: (index: number) => void;
  selectedIndexes: number[];
  setSelectedIndexes: (indexes: number[]) => void;
  setSelectable: (selectable: boolean) => void;
}

export const MyNFTTab = (props: Props) => {
  const {
    loading,
    isSelecttionMode,
    previewIndex,
    setPreviewIndex,
    selectedIndexes,
    setSelectedIndexes,
    setSelectable,
  } = props;
  const { nftData } = useNFTStaking();
  const { address } = useConnectedWallet();
  const [width, setWidth] = useState(0);

  const selectable = !!address && !loading && nftData.length > 0;
  useEffect(() => {
    setSelectable(selectable);
  }, [selectable, setSelectable]);

  return (
    <NFTTabContent
      loading={loading}
      empty={!nftData.length}
      className="md:absolute inset-0"
    >
      <ScrollArea className="h-full">
        <ScrollAreaViewport>
          <div
            ref={(ref) => {
              if (ref) setWidth(ref.offsetWidth);
            }}
            className="grid gap-2 p-2"
            style={{
              gridTemplateColumns: `repeat(${Math.floor(
                (width - 8) / (128 + 8)
              )}, 1fr)`,
            }}
          >
            {nftData.map((data, index) => (
              <MyNFTCard
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
