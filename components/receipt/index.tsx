import Image from "next/image";
import { Avatar, Badge, Typography } from "@mochi-ui/core";
import { CornerBottomLeftLine, LinkLine } from "@mochi-ui/icons";
import clsx from "clsx";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { utils } from "@consolelabs/mochi-formatter";
import ListUser from "./list-user";
import Header from "./header";
import {
  transactionActionIcon,
  transactionActionString,
} from "@/constants/transactions";
import { Transaction } from "@/store/transactions";
import Amount from "@/components/amount";
import DashLine from "./dash-line";
import DataList from "./data-list";
import { CoinIconSrc } from "@/constants/tokens";
import { TemplateName, templates } from "./template";

interface Props {
  data: Transaction;
  variant?: "default" | "peeking";
  className?: string;
}

export default function Receipt({
  data,
  variant = "default",
  className,
}: Props) {
  const templateName =
    data.metadata?.template?.slug.toLowerCase() as TemplateName;
  const template = templates[templateName] ?? null;

  if (data.from.address && template?.title) {
    template.title = template.title.replace("<user>", data.from.address);
  }

  const statusComponent = useMemo(() => {
    if (data.status === "success") {
      return (
        <Badge
          className="border border-success-outline-border"
          appearance="success"
        >
          Success
        </Badge>
      );
    }
    if (data.status === "failed") {
      return (
        <Badge
          className="border border-danger-outline-border"
          appearance="danger"
        >
          Failed
        </Badge>
      );
    }
    return (
      <Badge
        appearance="neutral"
        className="capitalize border border-neutral-outline-border"
      >
        {data.status}
      </Badge>
    );
  }, [data.status]);

  return (
    <div
      className={clsx(
        "flex-1 gap-y-7 flex flex-col m-auto",
        variant === "peeking"
          ? "w-[640px] max-w-[640px]"
          : "w-[360px] max-w-[360px]",
        className
      )}
    >
      <div
        className={clsx("relative rounded-xl", {
          "backdrop-blur-md overflow-hidden shadow-lg": variant === "peeking",
          "drop-shadow-lg": variant !== "peeking",
        })}
      >
        {variant === "peeking" && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-background-surface"
            style={{ opacity: 0.85 }}
          />
        )}
        <div
          className={clsx(
            "flex relative flex-col gap-y-10 w-full text-center",
            {
              "rounded jagged-bottom bg-background-surface":
                variant !== "peeking",
              "rounded-xl": variant === "peeking",
            }
          )}
        >
          {variant === "default" && (
            <Header
              template={template}
              platformIcon={data.from.platformIcon}
              senderAvatar={data.from.avatar}
              code={data?.code}
              title={transactionActionString[data.action]}
              icon={transactionActionIcon[data.action]}
            />
          )}
          <div
            className={clsx("px-4 md:px-6 !text-text-secondary", {
              "flex flex-col gap-y-4 pb-10": variant === "default",
              "flex gap-x-16 !p-8": variant === "peeking",
            })}
          >
            <div
              className={clsx("flex flex-col gap-y-4", {
                "flex-1": variant !== "peeking",
                "w-1/2 justify-center": variant === "peeking",
              })}
            >
              <div className="flex relative flex-col items-center">
                {template ? null : (
                  <Avatar
                    smallSrc={data.from.platformIcon}
                    size="xl"
                    src={data.from.avatar}
                  />
                )}
                <div className="mt-2 text-sm">
                  <Typography
                    level="p5"
                    color="textPrimary"
                    className="inline"
                    fontWeight="md"
                  >
                    {utils.string.formatAddressUsername(data.from.address)}
                  </Typography>
                  <br />
                  <span className="text-xs capitalize">
                    {template
                      ? template.phrase
                      : transactionActionString[data.action] ?? "sent"}
                  </span>
                </div>
                <Amount
                  value={data.amount}
                  valueUsd={data.amountUsd}
                  tokenIcon={data.token.icon}
                  unit={data.token.symbol}
                  className="mt-4"
                />
              </div>
            </div>
            <div
              className={clsx("relative font-mono !text-text-secondary", {
                "flex-1": variant !== "peeking",
                "w-1/2 flex flex-col justify-center": variant === "peeking",
              })}
            >
              {variant !== "peeking" && <DashLine />}
              <div
                className={clsx("flex flex-col gap-y-2 gap-x-4", {
                  "pt-4": variant !== "peeking",
                })}
              >
                <DataList>
                  <ListUser
                    isPeeking={variant === "peeking"}
                    data={[
                      {
                        name: data.from.address,
                        url: `/tx/${data.code}`,
                        tokenIcon: data.token.icon,
                        amountDisplay: data.amount,
                        amountUsd: data.amountUsd,
                      },
                    ]}
                    title="Issued by"
                  />
                  <ListUser
                    isPeeking={variant === "peeking"}
                    data={[data, ...data.siblingTxs].map((d) => ({
                      name: d.to.address,
                      url: `/tx/${d.code}`,
                      tokenIcon: d.token.icon,
                      amountDisplay: d.singleAmount,
                      amountUsd: d.singleAmountUsd,
                    }))}
                    title="Recipients"
                  />
                  {data.siblingTxs.length > 0 ? <DashLine /> : null}
                </DataList>
              </div>
              <div className="flex flex-col gap-y-2 gap-x-4 py-2">
                <DataList>
                  <DataList.Item title="Amount">
                    <div className="flex gap-x-1 items-center">
                      <Image
                        width={12}
                        height={12}
                        src={data.token.icon || CoinIconSrc}
                        alt=""
                        className="object-contain"
                      />
                      <Typography
                        level="p6"
                        fontWeight="sm"
                        className="!text-text-secondary"
                      >
                        {data.amount} {data.token.symbol}
                      </Typography>
                    </div>
                  </DataList.Item>
                  {data.originalTxId ? (
                    <DataList.Item
                      title="Tx ID"
                      right={
                        <span className="underline text-xxs text-text-secondary">
                          {data.code.slice(0, 9)}
                        </span>
                      }
                    >
                      <DataList>
                        <div className="flex gap-x-2 self-stretch">
                          <CornerBottomLeftLine className="text-text-secondary shrink-0" />
                          <DataList.Item title="Group Tx ID">
                            <Link
                              href={`/tx/${data.originalTxId}`}
                              className="flex items-center text-xs underline"
                            >
                              {data.originalTxId}
                              <LinkLine />
                            </Link>
                          </DataList.Item>
                        </div>
                      </DataList>
                    </DataList.Item>
                  ) : (
                    <DataList.Item title="Tx ID">
                      <Typography
                        level="p6"
                        className="underline !text-text-secondary"
                        fontWeight="sm"
                      >
                        {data.code.slice(0, 9)}
                      </Typography>
                    </DataList.Item>
                  )}
                  <DataList.Item title="Date">
                    {format(new Date(data.rawDate), "MMM do, yyyy")}
                  </DataList.Item>
                  <DataList.Item title="Status">
                    {statusComponent}
                  </DataList.Item>
                </DataList>
              </div>
              <DashLine />
              <div className="flex justify-between pt-2 text-xs text-text-secondary">
                <span className="text-xs">
                  Mochi &copy; {new Date().getUTCFullYear()}
                </span>
                <span className="text-xs">
                  {format(new Date(data.rawDate), "dd/MM/yyyy hh:mmaa")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
