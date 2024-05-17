import { useTransactions } from "@/store/transactions";
import { ArrowDownLine, ArrowUpDownLine, ArrowUpLine } from "@mochi-ui/icons";
import { useCallback, useMemo } from "react";

export const TxHeaderTotalValue = () => {
  const {
    filters: { sort_by },
    setFilters,
    isLoading,
  } = useTransactions();

  const icon = useMemo(() => {
    if (sort_by === "total_usd+") return <ArrowUpLine className="w-3 h-3" />;
    if (sort_by === "total_usd-") return <ArrowDownLine className="w-3 h-3" />;
    return <ArrowUpDownLine className="w-4 h-4" />;
  }, [sort_by]);

  const setSort = useCallback(() => {
    if (sort_by === "total_usd+") return setFilters({ sort_by: "" });
    if (sort_by === "total_usd-") return setFilters({ sort_by: "total_usd+" });
    setFilters({ sort_by: "total_usd-" });
  }, [setFilters, sort_by]);

  return (
    <button
      type="button"
      disabled={isLoading}
      className="flex gap-x-1 justify-between items-center focus:outline-none"
      onClick={setSort}
    >
      <span>TOTAL VALUE</span>
      {icon}
    </button>
  );
};
