import { useTransactions } from "@/store/transactions";
import { ArrowDownLine, ArrowUpDownLine, ArrowUpLine } from "@mochi-ui/icons";
import { useCallback, useMemo } from "react";

export const TxHeaderWen = () => {
  const {
    filters: { sort_by },
    setFilters,
    isLoading,
  } = useTransactions();

  const icon = useMemo(() => {
    if (sort_by === "created_at+") return <ArrowUpLine className="w-3 h-3" />;
    if (sort_by === "created_at-") return <ArrowDownLine className="w-3 h-3" />;
    return <ArrowUpDownLine className="w-4 h-4" />;
  }, [sort_by]);

  const setSort = useCallback(() => {
    if (sort_by === "created_at+") {
      return setFilters({ sort_by: "" });
    }
    if (sort_by === "created_at-") {
      return setFilters({ sort_by: "created_at+" });
    }
    setFilters({ sort_by: "created_at-" });
  }, [setFilters, sort_by]);

  return (
    <button
      disabled={isLoading}
      type="button"
      className="flex gap-x-1 justify-between items-center focus:outline-none"
      onClick={setSort}
    >
      <span>WEN</span>
      {icon}
    </button>
  );
};
