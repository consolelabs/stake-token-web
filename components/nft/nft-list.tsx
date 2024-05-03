import { NftData } from "@/store/nft-staking";
import { utils } from "@consolelabs/mochi-formatter";
import {
  ColumnProps,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTrigger,
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  Table,
  Typography,
} from "@mochi-ui/core";
import { StarSolid } from "@mochi-ui/icons";
import Image from "next/image";

const BoosterName: ColumnProps<NftData>["cell"] = (props) => {
  const { name = "", image = "" } = props.row.original;

  return (
    <div className="flex items-center space-x-3.5 min-w-[200px]">
      <Modal>
        <ModalTrigger asChild>
          <Image
            src={image}
            alt={name}
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </ModalTrigger>
        <ModalPortal>
          <ModalOverlay />
          <ModalContent className="outline-none">
            <Image src={image} alt={name} width={128} height={128} />
          </ModalContent>
        </ModalPortal>
      </Modal>
      <Typography level="p5" fontWeight="xl">
        {name}
      </Typography>
    </div>
  );
};

const Level: ColumnProps<NftData>["cell"] = (props) => {
  const { attribute } = props.row.original;
  const tier = attribute?.tier || 0;

  return (
    <div className="flex justify-end space-x-0.5">
      {Array.from({ length: tier }).map((_, index) => (
        <StarSolid
          key={index}
          className="w-5 h-5 text-warning-outline-border"
        />
      ))}
    </div>
  );
};

const Effect: ColumnProps<NftData>["cell"] = (props) => {
  const { attribute } = props.row.original;
  const boostStaking = attribute?.boostStaking || 0;

  return (
    <Typography level="p5" color="success">
      + {utils.formatPercentDigit(boostStaking)}
    </Typography>
  );
};

interface Props {
  nftList: NftData[];
  loading: boolean;
}

export const NFTList = (props: Props) => {
  const { nftList, loading } = props;

  return (
    <ScrollArea>
      <ScrollAreaViewport>
        <Table
          className="min-w-[700px]"
          cellClassName={() => "!p-4"}
          data={nftList}
          isLoading={loading && !nftList.length}
          columns={[
            {
              accessorKey: "boosterName",
              header: "Booster name",
              cell: BoosterName,
            },
            {
              accessorKey: "level",
              header: "Level",
              width: "15%",
              cell: Level,
              meta: {
                align: "right",
              },
            },
            {
              accessorKey: "attribute.quantity",
              header: "Supply",
              width: "15%",
              meta: {
                align: "right",
              },
            },
            {
              accessorKey: "effect",
              header: "Effect",
              width: "15%",
              cell: Effect,
              meta: {
                align: "right",
              },
            },
            {
              accessorKey: "attribute.duration",
              header: "Duration",
              width: "15%",
              accessorFn: (row) =>
                row.attribute?.duration && row.attribute.duration > 1
                  ? `${utils.formatDigit({
                      value: row.attribute.duration,
                    })} days`
                  : `${row.attribute?.duration || 0} day`,
              meta: {
                align: "right",
              },
            },
          ]}
        />
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
};
