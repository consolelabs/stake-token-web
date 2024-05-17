import { Transaction } from "@/store/transactions";
import { Tooltip } from "@mochi-ui/core";
import { StatusIcon } from "./status-icon";
import { useClipboard } from "@dwarvesf/react-hooks";
import { TxGroup } from "./tx-group";
import { CopyLine } from "@mochi-ui/icons";
import Receipt from "@/components/receipt";

export type Props = {
  tx: Transaction;
};

export const TxId = (props: Props) => {
  const { tx } = props;
  const { onCopy, hasCopied } = useClipboard(tx.code);

  return (
    <div className="flex gap-1.5 items-center pl-2">
      <StatusIcon tx={tx} />
      <Tooltip
        content={<Receipt data={tx} variant="peeking" />}
        className="!shadow-none bg-transparent"
        arrow="right-center"
        componentProps={{
          trigger: { className: "flex" },
        }}
      >
        <TxGroup tx={tx} />
      </Tooltip>
      <Tooltip
        content={hasCopied ? "Copied" : "Click to copy tx id"}
        arrow="top-center"
        componentProps={{
          root: { open: hasCopied || undefined },
        }}
      >
        <CopyLine
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
        />
      </Tooltip>
    </div>
  );
};
