import {
  Button,
  ColumnProps,
  Pagination,
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  Table,
  Typography,
} from "@mochi-ui/core";
import { useEffect, useRef } from "react";
import { ArrowRightShortLine } from "@mochi-ui/icons";
import { TxHeaderWen } from "./headers/wen";
import { Transaction, useTransactions } from "@/store/transactions";
import { TRANSACTION_ACTIONS, TxHeaderAction } from "./headers/action";
import { TxBadge } from "./tx-badge";
import { TxIssuedBy } from "./tx-issued-by";
import { TxRecipients } from "./tx-recipients";
import { TxHeaderTotalValue } from "./headers/total-value";
import Amount from "../../amount";
import { TxWhere } from "./tx-where";
import { TxId } from "./tx-id";
import useSWR from "swr";
import { transform } from "@/utils/transaction";
import { API } from "@/constants/api";

const columns: ColumnProps<Transaction>[] = [
  {
    header: () => <span className="px-1 pl-2">#</span>,
    id: "txId",
    width: "5%",
    cell: (props) => {
      const tx = props.row.original;

      return <TxId tx={tx} />;
    },
  },
  {
    header: () => <TxHeaderWen />,
    id: "wen",
    width: "10%",
    cell: (props) => {
      const tx = props.row.original;

      return (
        <Typography level="p5" className="w-max tabular-nums text-left">
          {tx.date}
        </Typography>
      );
    },
  },
  {
    header: () => <TxHeaderAction />,
    id: "type",
    width: "8%",
    cell: (props) => {
      const tx = props.row.original;

      return <TxBadge action={tx.action} />;
    },
  },
  {
    header: "issued by",
    id: "from",
    width: "7%",
    cell: (props) => {
      const tx = props.row.original;

      return <TxIssuedBy tx={tx} />;
    },
  },
  {
    header: "",
    id: "decoration arrow",
    width: "2%",
    cell: () => {
      return (
        <div className="flex justify-center items-center p-1 w-5 h-5 rounded-full border border-neutral-outline-border">
          <ArrowRightShortLine />
        </div>
      );
    },
  },
  {
    header: "recipients",
    id: "to",
    width: "7%",
    cell: (props) => {
      const tx = props.row.original;

      return <TxRecipients tx={tx} />;
    },
  },
  {
    header: () => <TxHeaderTotalValue />,
    id: "amount",
    width: "8%",
    cell: (props) => {
      const tx = props.row.original;

      return (
        <div className="w-max">
          <Amount
            size="sm"
            value={tx.amount}
            valueUsd={tx.amountUsd}
            unit={tx.token.symbol}
            tokenIcon={tx.token.icon}
            alignment="left"
          />
        </div>
      );
    },
  },
  {
    header: "where",
    id: "where",
    width: "8%",
    cell: (props) => {
      const tx = props.row.original;

      return <TxWhere tx={tx} />;
    },
  },
  {
    header: "",
    id: "action",
    width: 50,
    cell: () => {
      return (
        <Button
          variant="soft"
          color="primary"
          className="border-none !shadow-none"
        >
          View
        </Button>
      );
    },
  },
];

export const Transactions = () => {
  const {
    transactions = [],
    pagination,
    filters,
    isLoading,
    setPagination,
    setValues,
  } = useTransactions();
  const isEmpty = transactions.length === 0;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filters, pagination]);

  const { actions, ...rest } = filters;
  useSWR(["transactions", filters, pagination], () => {
    setValues({ isLoading: true });
    return API.TONO.query({
      ...rest,
      ...pagination,
      action: (actions?.length
        ? actions
        : TRANSACTION_ACTIONS.map((each) => each.id)
      ).join("|"),
    })
      .get("/guilds/462663954813157376/community/token/transactions")
      .json(async (res) => {
        const getTransactions = await Promise.allSettled(
          res.data.transactions?.map((d: any) =>
            transform(d, res.data.token)
          ) || []
        );
        console.log({ getTransactions });
        return {
          ...res.data,
          transactions: getTransactions.flatMap((tx) =>
            tx.status === "fulfilled" ? tx.value : []
          ),
        };
      })
      .then((data) => {
        setValues({ ...data, isLoading: false });
      });
  });

  return (
    <div className="mx-auto">
      <ScrollArea>
        <ScrollAreaViewport
          ref={scrollRef}
          className="max-w-[calc(100vw-150px)]"
        >
          <Table
            size="sm"
            loadingRows={pagination.size}
            data={transactions}
            isLoading={isLoading && isEmpty}
            columns={columns}
            className="p-0"
            rowClassName={(row) => (row.isNew ? "animate-new-tx-fade-out" : "")}
            headerCellClassName={() => "z-auto"}
            onRow={(tx) => ({
              onClick: () => {
                window.open(`https://mochi.gg/tx/${tx.code}`);
              },
            })}
          />
        </ScrollAreaViewport>
        {!isEmpty && (
          <ScrollAreaScrollbar orientation="horizontal">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
        )}
      </ScrollArea>
      {isEmpty && (
        <div className="w-full h-[80vh] flex flex-col gap-1 items-center justify-center">
          <Typography level="h7">No result found</Typography>
          <Typography level="p5" color="textSecondary">
            Try searching for something else.
          </Typography>
        </div>
      )}
      <div className="py-4 w-full text-sm">
        <Pagination
          recordName="transactions"
          initalPage={pagination.page + 1}
          initItemsPerPage={pagination.size}
          page={pagination.page + 1}
          totalItems={pagination.total}
          onItemPerPageChange={(size) => setPagination({ size })}
          onPageChange={(page) => setPagination({ page: page - 1 })}
          allowCustomPage
        />
      </div>
    </div>
  );
};
