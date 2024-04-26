import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  TabContent,
  TabList,
  TabTrigger,
  Tabs,
  toast,
} from "@mochi-ui/core";
import { CloseLgLine } from "@mochi-ui/icons";
import { useEffect, useState } from "react";
import { useDisclosure } from "@dwarvesf/react-hooks";
import { MyNFTTab } from "./my-nft-tab";
import clsx from "clsx";
import { StakedNFTTab } from "./staked-nft-tab";
import { NFTDetail } from "./nft-detail";
import { useNFTStaking } from "@/store/nft-staking";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS = {
  MY_NFTS: "MY_NFTS",
  STAKED_NFTS: "STAKED_NFTS",
} as const;

export const NFTModal = (props: Props) => {
  const { open, onOpenChange } = props;
  const { nftContract, initializeNFTData } = useNFTStaking();
  const [tab, setTab] = useState<keyof typeof TABS>(TABS.MY_NFTS);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectable, setSelectable] = useState(false);
  const {
    isOpen: isSelecttionMode,
    onToggle: onToggleSelecttionMode,
    onClose: onCloseSelecttionMode,
  } = useDisclosure();

  useEffect(() => {
    if (!nftContract) return;
    const init = async () => {
      try {
        setLoading(true);
        await initializeNFTData();
      } catch (err: any) {
        toast({
          scheme: "danger",
          title: "Error",
          description:
            typeof err.message === "string"
              ? err.message
              : "Failed to initialize NFT data",
        });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [initializeNFTData, nftContract]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="w-full !p-0 max-w-5xl">
          <ScrollArea>
            <ScrollAreaViewport className="max-h-[90vh] md:max-h-full">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,320px] relative">
                <ModalClose className="absolute top-4 right-4 z-10">
                  <CloseLgLine className="w-7 h-7" />
                </ModalClose>
                <Tabs
                  value={tab}
                  onValueChange={(value) => {
                    setTab(value as keyof typeof TABS);
                    onCloseSelecttionMode();
                    setPreviewIndex(0);
                  }}
                  className="px-6 pb-6 flex-1 flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <TabList className="py-4 relative">
                      {[
                        {
                          key: TABS.MY_NFTS,
                          label: "My NFTs",
                        },
                        {
                          key: TABS.STAKED_NFTS,
                          label: "Staked NFTs",
                        },
                      ].map(({ key, label }) => (
                        <TabTrigger
                          key={key}
                          value={key}
                          className={clsx("font-semibold rounded-lg px-4 h-8", {
                            "bg-primary-soft": tab === key,
                          })}
                        >
                          {label}
                        </TabTrigger>
                      ))}
                    </TabList>
                    <div className="flex items-center mr-7 md:mr-0 space-x-2">
                      {isSelecttionMode && selectedIndexes.length > 0 && (
                        <Button>
                          {tab === TABS.STAKED_NFTS ? "Unstake" : "Stake"} (
                          {selectedIndexes.length})
                        </Button>
                      )}
                      <Button
                        variant="link"
                        color="neutral"
                        className="pl-2 pr-2"
                        disabled={!selectable}
                        onClick={() => {
                          if (!isSelecttionMode) {
                            setSelectedIndexes([previewIndex]);
                          }
                          onToggleSelecttionMode();
                        }}
                      >
                        {isSelecttionMode ? "Unselect" : "Select"}
                      </Button>
                    </div>
                  </div>
                  <TabContent
                    value={TABS.MY_NFTS}
                    className="rounded-2xl bg-background-level2 flex-1 relative overflow-hidden"
                  >
                    <MyNFTTab
                      {...{
                        loading,
                        isSelecttionMode,
                        previewIndex,
                        setPreviewIndex,
                        selectedIndexes,
                        setSelectedIndexes,
                        setSelectable,
                      }}
                    />
                  </TabContent>
                  <TabContent
                    value={TABS.STAKED_NFTS}
                    className="rounded-2xl bg-background-level2 flex-1 relative overflow-hidden"
                  >
                    <StakedNFTTab
                      {...{
                        loading,
                        isSelecttionMode,
                        previewIndex,
                        setPreviewIndex,
                        selectedIndexes,
                        setSelectedIndexes,
                      }}
                    />
                  </TabContent>
                </Tabs>
                <NFTDetail
                  isStakedNFT={tab === TABS.STAKED_NFTS}
                  previewIndex={previewIndex}
                />
              </div>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar>
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          </ScrollArea>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};
