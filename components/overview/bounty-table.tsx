import { useServerInfo } from "@/store/server-info";
import { Badge, Table, Typography } from "@mochi-ui/core";
import {
  BulletsListLine,
  CalendarLine,
  ChartLine,
  GiftLine,
  TrophyLine,
  TwinkleSolid,
} from "@mochi-ui/icons";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
dayjs.extend(utc);

export function BountyTable() {
  const { data } = useServerInfo();

  return (
    <div className="flex flex-col py-6">
      <Typography level="h5" className="font-medium">
        Bounty
      </Typography>
      <div className="py-6">
        <Table
          columns={[
            {
              id: "index",
              accessorFn: (_, index) => index + 1,
              header: () => <BulletsListLine className="w-4 h-4" />,
            },
            {
              accessorKey: "name",
              header: () => (
                <Typography
                  level="p6"
                  className="flex gap-x-2 items-center text-neutral-500"
                >
                  <GiftLine className="w-3 h-3" /> BOUNTY
                </Typography>
              ),
            },
            {
              id: "reward",
              cell: ({ row }) => (
                <Typography level="p6" className="flex gap-x-2 items-center">
                  <TwinkleSolid className="w-4 h-4 text-warning-solid" />
                  {row.original.reward}
                </Typography>
              ),
              header: () => (
                <Typography
                  level="p6"
                  className="flex gap-x-2 items-center text-neutral-500"
                >
                  <TrophyLine />
                  REWARD
                </Typography>
              ),
            },
            {
              id: "duedate",
              accessorFn: (row) =>
                dayjs(row.expired).utc(true).format("DD/MM/YYYY"),
              header: () => (
                <Typography
                  level="p6"
                  className="flex gap-x-2 items-center text-neutral-500"
                >
                  <CalendarLine />
                  DUEDATE
                </Typography>
              ),
            },
            {
              id: "status",
              cell: ({ row }) => (
                <Badge
                  className="ml-auto w-max capitalize"
                  appearance={
                    row.original.status === "review"
                      ? "secondary"
                      : row.original.status === "open"
                      ? "success"
                      : "primary"
                  }
                >
                  {row.original.status}
                </Badge>
              ),
              header: () => (
                <Typography
                  level="p6"
                  className="flex gap-x-2 justify-end items-center text-neutral-500"
                >
                  <ChartLine /> STATUS
                </Typography>
              ),
            },
          ]}
          data={data?.bounty ?? []}
        />
      </div>
    </div>
  );
}
