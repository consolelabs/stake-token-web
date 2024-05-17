import { Avatar, AvatarGroup, Tooltip, Typography } from "@mochi-ui/core";
import { Transaction } from "@/store/transactions";
import { utils } from "@consolelabs/mochi-formatter";
import { CopyLine } from "@mochi-ui/icons";
import { useClipboard } from "@dwarvesf/react-hooks";
import clsx from "clsx";
import emojiStrip from "emoji-strip";
import Image from "next/image";

const buildAddressString = (addresses: Array<string>) => {
  const initialAddresses = addresses.slice(0, 1);
  const remainingAddresses = addresses.slice(1);
  const isInitialAddress = utils.address.isAddress(initialAddresses[0]).valid;

  const remainingAddressCount = remainingAddresses.length;
  const initialAddressString = initialAddresses
    .map((s) =>
      remainingAddressCount === 0 &&
      typeof s === "string" &&
      !utils.address.isAddress(s).valid
        ? utils.string.formatAddressUsername(s, 20)
        : utils.string.formatAddressUsername(s, 10)
    )
    .join(", ");

  let first: React.ReactNode = initialAddressString;

  if (isInitialAddress) {
    first = (
      <Typography className="inline font-mono" level="p5">
        {initialAddressString}
      </Typography>
    );
  }

  if (remainingAddressCount === 0) {
    return first;
  }

  if (isInitialAddress) {
    return (
      <>
        {first} & {remainingAddressCount}{" "}
        {remainingAddressCount > 1 ? "people" : "person"}
      </>
    );
  }

  return `${initialAddressString} & ${remainingAddressCount} ${
    remainingAddressCount > 1 ? "people" : "person"
  }`;
};

export type Props = {
  tx: Transaction;
};

export const TxRecipients = (props: Props) => {
  const { tx } = props;

  const allTxs = [tx, ...tx.siblingTxs];
  const allAddresses = Array.from(
    new Set(allTxs.map((tx) => emojiStrip(tx.to.address)))
  );
  const uniqueAllTxs = allTxs.filter(
    (tx, index, self) =>
      self.findIndex((t) => t.to.address === tx.to.address) === index
  );
  const hasAddress =
    allAddresses.some((addr) => utils.address.isAddress(addr).valid) &&
    ["paylink", "withdraw"].includes(tx.action);

  const { hasCopied, onCopy } = useClipboard(allAddresses[0]);

  const text = (
    <Typography level="p5" className="break-words truncate">
      {buildAddressString(allAddresses)}
    </Typography>
  );

  return (
    <div className="flex gap-3 items-center">
      <AvatarGroup size="sm">
        {uniqueAllTxs.map((tx) => (
          <Avatar
            size="sm"
            key={tx.code}
            src={tx.to.avatar}
            fallback={tx.to.address}
            {...(uniqueAllTxs.length > 1
              ? {}
              : { smallSrc: tx.to.platformIcon })}
          />
        ))}
      </AvatarGroup>
      <div className="flex gap-1.5">
        {allAddresses.length > 1 || hasAddress ? (
          <>
            <Tooltip
              content={
                <div className="flex flex-col gap-2">
                  {allAddresses.map((address, i) => (
                    <div className="flex gap-x-2 justify-between" key={address}>
                      <Typography
                        level="p5"
                        fontWeight="md"
                        className={clsx("!text-inherit", {
                          "font-mono": utils.address.isAddress(address).valid,
                        })}
                      >
                        {address}
                        {!hasAddress && ":"}
                      </Typography>
                      {!hasAddress && (
                        <div className="flex gap-x-1 items-center">
                          <Image
                            width={16}
                            height={16}
                            src={allTxs[i].token.icon || ""}
                            alt=""
                            className="ml-1 w-4 h-4"
                          />
                          <Typography
                            level="p5"
                            fontWeight="md"
                            className="font-mono !text-inherit"
                          >
                            {allTxs[i].singleAmount} {allTxs[i].token.symbol}
                          </Typography>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              }
            >
              {text}
            </Tooltip>
            {hasAddress && (
              <Tooltip
                content={hasCopied ? "Copied" : "Click to copy address"}
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
            )}
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
};
