import { Badge, Tooltip, Typography } from "@mochi-ui/core";
import { InfoCircleOutlined, TwinkleSolid } from "@mochi-ui/icons";
import clsx from "clsx";
import { ReactNode } from "react";

interface Item {
  label?: string;
  value: string | number | ReactNode;
  convertedValue?: string;
  hidden?: boolean;
}

interface Props {
  isBoosting?: boolean;
  tags: ReactNode;
  headerExtra: ReactNode;
  icon: ReactNode;
  title: string;
  description: string;
  highlightItems: Item[];
  items: Item[];
  actions: ReactNode;
  claimableRewards: Item;
  footerExtra?: ReactNode;
}

export const Card = (props: Props) => {
  const {
    isBoosting = false,
    tags,
    headerExtra,
    icon,
    title,
    description,
    highlightItems,
    items,
    actions,
    claimableRewards,
    footerExtra,
  } = props;

  return (
    <div
      className={clsx(
        "rounded-2xl relative bg-background-surface flex flex-col",
        isBoosting
          ? "border-2 border-transparent bg-clip-padding before:absolute before:z-[-1] before:inset-0 before:-m-0.5 before:bg-gradient-to-br before:from-[#1570EF] before:to-[#F00C88] before:rounded-2xl"
          : "border border-neutral-outline-border p-[1px]"
      )}
    >
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {tags}
          {isBoosting && (
            <Badge
              key="boosted"
              appearance="danger"
              className="border border-danger-soft-active"
            >
              <TwinkleSolid className="text-danger-solid w-3 h-3" />
              Boosted
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">{headerExtra}</div>
      </div>
      <div className="px-4 flex flex-col flex-1">
        <div className="py-2 space-x-2 flex items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-background-level1">
            {icon}
          </div>
          <div className="flex items-center space-x-1">
            <Typography className="text-xl font-semibold">{title}</Typography>
            <Tooltip
              content={description}
              className="max-w-xs"
              arrow="top-center"
            >
              <InfoCircleOutlined className="w-4 h-4 text-text-icon-secondary" />
            </Tooltip>
          </div>
        </div>
        <div className="rounded-lg bg-primary-soft px-4 py-2 grid grid-cols-2 gap-2">
          {highlightItems.map((item) => (
            <div key={item.label} className="space-y-0.5 flex flex-col">
              <Typography level="p6" color="primary">
                {item.label}
              </Typography>
              {typeof item.value === "string" ||
              typeof item.value === "number" ? (
                <Typography level="p6" fontWeight="lg" color="primary">
                  {item.value}
                </Typography>
              ) : (
                item.value
              )}
            </div>
          ))}
        </div>
        <div className="pt-1 pb-2 grid grid-cols-2 auto-rows-min gap-x-2 flex-1">
          {items.map((item) => (
            <div
              key={item.label}
              className="space-y-0.5 flex flex-col py-2 min-h-[56px]"
            >
              {!!item.label && (
                <Typography level="p6" className="text-text-tertiary">
                  {item.label}
                </Typography>
              )}
              {typeof item.value === "string" ||
              typeof item.value === "number" ||
              item.hidden ? (
                <Typography level="h9">
                  {item.hidden ? "*****" : item.value}
                </Typography>
              ) : (
                item.value
              )}
              {!!item.convertedValue && (
                <Typography level="p6" className="text-text-tertiary">
                  {item.hidden ? "*****" : `≈ ${item.convertedValue}`}
                </Typography>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">{actions}</div>
        <div className="grid grid-cols-2 items-center gap-2 py-2">
          <div className="py-2 space-y-0.5 flex flex-col">
            <Typography level="p6" className="text-text-tertiary">
              Claimable Rewards
            </Typography>
            {typeof claimableRewards.value === "string" ||
            claimableRewards.hidden ? (
              <Typography level="p5" fontWeight="lg">
                {claimableRewards.hidden ? "*****" : claimableRewards.value}
              </Typography>
            ) : (
              claimableRewards.value
            )}
          </div>
          {footerExtra}
        </div>
      </div>
    </div>
  );
};
