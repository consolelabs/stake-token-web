import { Transaction } from "@/store/transactions";
import { Typography } from "@mochi-ui/core";

export type Props = {
  tx: Transaction;
};

export const TxGroup = (props: Props) => {
  const { tx } = props;

  return (
    <Typography
      level="p6"
      className="py-0.5 px-2 font-mono rounded-full border border-background-level3 bg-background-level1 !h-[20px] !w-[53px] flex items-center"
    >
      {tx.code.slice(0, 5)}
    </Typography>
  );
};
