import { Transaction } from "@/store/transactions";
import { Tooltip } from "@mochi-ui/core";
import {
  InfoCircleOutlined,
  CheckCircleHalfColoredLine,
  ClockCircleArrowColoredLine,
} from "@mochi-ui/icons";
import { useMemo } from "react";

export type Props = {
  tx: Transaction;
  size?: number;
};

export const StatusIcon = (props: Props) => {
  const { tx, size = 16 } = props;

  const iconRender = useMemo(() => {
    switch (tx.status) {
      case "submitted":
      case "pending": {
        return <ClockCircleArrowColoredLine width={size} height={size} />;
      }
      case "failed":
      case "expired": {
        return (
          <InfoCircleOutlined
            width={size}
            height={size}
            className="text-danger-solid"
          />
        );
      }
      case "success": {
        return <CheckCircleHalfColoredLine width={size} height={size} />;
      }
      default: {
        return null;
      }
    }
  }, [tx.status, size]);

  return (
    <Tooltip content={<div className="capitalize">{tx.status}</div>}>
      {iconRender}
    </Tooltip>
  );
};
