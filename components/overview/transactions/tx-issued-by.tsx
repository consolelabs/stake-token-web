import { Avatar, Tooltip, Typography } from "@mochi-ui/core";
import { Transaction } from "@/store/transactions";
import { utils } from "@consolelabs/mochi-formatter";
import { CopyLine } from "@mochi-ui/icons";
import { useClipboard } from "@dwarvesf/react-hooks";
import clsx from "clsx";
import emojiStrip from "emoji-strip";

export type Props = {
  tx: Transaction;
};

export const TxIssuedBy = (props: Props) => {
  const { tx } = props;

  const { address: _address, avatar, platformIcon } = tx.from;
  const address = emojiStrip(_address);
  const { hasCopied, onCopy } = useClipboard(address);
  const isValid = utils.address.isAddress(address).valid;
  const hasAddress = isValid && ["payme", "deposit"].includes(tx.action);

  const text = isValid ? (
    <Typography level="p5" className="break-words truncate">
      <Typography className="inline font-mono" level="p5">
        {utils.string.formatAddressUsername(address, 10)}
      </Typography>
    </Typography>
  ) : (
    <Typography level="p5" className="break-words truncate">
      {utils.string.formatAddressUsername(address, 20)}
    </Typography>
  );

  return (
    <div className="flex gap-3 items-center">
      <Avatar
        size="sm"
        key={tx.code}
        src={avatar}
        fallback={address}
        smallSrc={platformIcon}
      />
      <div className="flex gap-1.5">
        {hasAddress ? (
          <>
            <Tooltip
              content={
                <div className="flex flex-col gap-2">
                  <Typography
                    level="p5"
                    fontWeight="md"
                    className={clsx("!text-inherit", {
                      "font-mono": utils.address.isAddress(address).valid,
                    })}
                  >
                    {address}
                  </Typography>
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
