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

interface NFTData {
  name: string;
  src: string;
  level: number;
  supply: number;
  effect: number;
  duration: string;
}

const BoosterName: ColumnProps<NFTData>["cell"] = (props) => {
  const { name, src } = props.row.original;

  return (
    <div className="flex items-center space-x-3.5 min-w-[200px]">
      <Modal>
        <ModalTrigger asChild>
          <Image
            src={src}
            alt={name}
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </ModalTrigger>
        <ModalPortal>
          <ModalOverlay />
          <ModalContent className="outline-none">
            <Image src={src} alt={name} width={128} height={128} />
          </ModalContent>
        </ModalPortal>
      </Modal>
      <Typography level="p5" fontWeight="xl">
        {name}
      </Typography>
    </div>
  );
};

const Level: ColumnProps<NFTData>["cell"] = (props) => {
  const { level } = props.row.original;

  return (
    <div className="flex justify-end space-x-0.5">
      {Array.from({ length: level }).map((_, index) => (
        <StarSolid
          key={index}
          className="w-5 h-5 text-warning-outline-border"
        />
      ))}
    </div>
  );
};

const Effect: ColumnProps<NFTData>["cell"] = (props) => {
  const { effect } = props.row.original;

  return (
    <Typography level="p5" color={effect < 0 ? "danger" : "success"}>
      {effect < 0 ? "-" : "+"} {effect * 100}%
    </Typography>
  );
};

export const NFTList = () => {
  return (
    <ScrollArea>
      <ScrollAreaViewport>
        <Table
          className="min-w-[700px]"
          cellClassName={() => "!p-4"}
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
              accessorKey: "supply",
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
              accessorKey: "duration",
              header: "Duration",
              width: "15%",
              meta: {
                align: "right",
              },
            },
          ]}
          data={[
            {
              name: "Thor's Hammer",
              src: "/nft/thor-hammer.png",
              level: 5,
              supply: 1,
              effect: 0.3,
              duration: "360 days",
            },
            {
              name: "Loki's Sword",
              src: "/nft/loki-sword.png",
              level: 5,
              supply: 1,
              effect: 0.3,
              duration: "360 days",
            },
            {
              name: "Járngreipr",
              src: "/nft/jarngreipr.png",
              level: 4,
              supply: 2,
              effect: 0.3,
              duration: "200 days",
            },
            {
              name: "Gungnir",
              src: "/nft/gungnir.png",
              level: 4,
              supply: 2,
              effect: 0.3,
              duration: "200 days",
            },
            {
              name: "Firewood",
              src: "/nft/vali-manteau.png",
              level: 4,
              supply: 2,
              effect: 0.3,
              duration: "100 days",
            },
            {
              name: "Andvaranaut Ring",
              src: "/nft/andvaranaut-ring.png",
              level: 4,
              supply: 3,
              effect: 0.2,
              duration: "100 days",
            },
            {
              name: "Norns' Spindle",
              src: "/nft/norns-spindle.png",
              level: 4,
              supply: 3,
              effect: 0.2,
              duration: "100 days",
            },
            {
              name: "Vidar's Boots",
              src: "/nft/vidar-boots.png",
              level: 4,
              supply: 3,
              effect: 0.2,
              duration: "100 days",
            },
            {
              name: "Odin's Blessing",
              src: "/nft/odin-blessing.png",
              level: 4,
              supply: 3,
              effect: 0.2,
              duration: "100 days",
            },
            {
              name: "Völuspá",
              src: "/nft/voluspa.png",
              level: 3,
              supply: 3,
              effect: 0.2,
              duration: "100 days",
            },
            {
              name: "Potion Of Strength",
              src: "/nft/potion-strength.png",
              level: 3,
              supply: 4,
              effect: 0.15,
              duration: "90 days",
            },
            {
              name: "Galdrar",
              src: "/nft/galdrar.png",
              level: 3,
              supply: 4,
              effect: 0.15,
              duration: "90 days",
            },
            {
              name: "Fire Magic",
              src: "/nft/fire-magic.png",
              level: 3,
              supply: 4,
              effect: 0.15,
              duration: "90 days",
            },
            {
              name: "Anvil",
              src: "/nft/anvil.png",
              level: 3,
              supply: 4,
              effect: 0.15,
              duration: "90 days",
            },
            {
              name: "Golden Apple",
              src: "/nft/golden-apple.png",
              level: 3,
              supply: 4,
              effect: 0.15,
              duration: "90 days",
            },
            {
              name: "Crow Feathers",
              src: "/nft/crow-feathers.png",
              level: 2,
              supply: 5,
              effect: 0.1,
              duration: "30 days",
            },
            {
              name: "Amanita Muscaria",
              src: "/nft/amanita-muscaria.png",
              level: 2,
              supply: 5,
              effect: 0.1,
              duration: "30 days",
            },
            {
              name: "Oak Leaves",
              src: "/nft/oak-leaves.png",
              level: 2,
              supply: 5,
              effect: 0.1,
              duration: "30 days",
            },
            {
              name: "Leather",
              src: "/nft/leather.png",
              level: 2,
              supply: 5,
              effect: 0.1,
              duration: "30 days",
            },
            {
              name: "Gold",
              src: "/nft/gold.png",
              level: 2,
              supply: 5,
              effect: 0.1,
              duration: "30 days",
            },
            {
              name: "Iron",
              src: "/nft/iron.png",
              level: 2,
              supply: 6,
              effect: 0.05,
              duration: "15 days",
            },
            {
              name: "Tools",
              src: "/nft/tool.png",
              level: 2,
              supply: 6,
              effect: 0.05,
              duration: "15 days",
            },
            {
              name: "Oak Planks",
              src: "/nft/oak-planks.png",
              level: 2,
              supply: 6,
              effect: 0.05,
              duration: "15 days",
            },
            {
              name: "Stone",
              src: "/nft/stone.png",
              level: 1,
              supply: 7,
              effect: 0.05,
              duration: "7 days",
            },
            {
              name: "Firewood",
              src: "/nft/wood.png",
              level: 1,
              supply: 7,
              effect: 0.05,
              duration: "7 days",
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
