import { Avatar, Badge, BadgeIcon, Tooltip } from "@mochi-ui/core";
import { Transaction } from "@/store/transactions";
import { truncate } from "@dwarvesf/react-utils";

export type Props = {
  tx: Transaction;
};

export const TxWhere = (props: Props) => {
  const { tx } = props;
  const truncatedVal = truncate(tx.where.text, 20);
  const isTruncated = truncatedVal !== tx.where.text;

  return (
    <Badge
      className="inline-flex border border-background-level3 bg-background-level1"
      appearance="neutral"
    >
      <BadgeIcon className="-ml-0.5">
        {typeof tx.where.avatar === "string" ? (
          <Avatar src={tx.where.avatar} size="xxs" />
        ) : (
          <div className="flex justify-center items-center w-4 h-4 rounded-full">
            <tx.where.avatar />
          </div>
        )}
      </BadgeIcon>
      {isTruncated ? (
        <Tooltip content={tx.where.text}>
          <span className="w-full truncate">{truncatedVal}</span>
        </Tooltip>
      ) : (
        <span className="w-full truncate">{truncatedVal}</span>
      )}
    </Badge>
  );
};
