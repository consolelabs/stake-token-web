import UI, {
  Platform,
  utils as mochiUtils,
} from "@consolelabs/mochi-formatter";
import { DiscordColored, TelegramColored, WebSolid } from "@mochi-ui/icons";
import emojiStrip from "emoji-strip";
import { formatDate, formatRelative } from "./datetime";
import { Token, Transaction } from "@/store/transactions";
import { formatTokenDigit } from "./number";

function isVault(source: string) {
  return source === "mochi-vault";
}

export async function transform(d: any, token: Token): Promise<Transaction> {
  let [from, to] = UI.render(
    Platform.Web,
    {
      ...d.from_profile,
      ...(d.from_profile?.application_vault
        ? {
            application_vault: {
              application: {
                id: d.from_profile.application_vault?.application_id,
                ...d.from_profile.application_vault,
              },
            },
          }
        : {}),
    },
    {
      ...d.other_profile,
      ...(d.other_profile?.application_vault
        ? {
            application_vault: {
              application: {
                id: d.other_profile.application_vault?.application_id,
                ...d.other_profile.application_vault,
              },
            },
          }
        : {}),
    }
  );
  let [fromAvatar, toAvatar] = [
    d.from_profile?.avatar || "",
    d.other_profile?.avatar || "",
  ];

  const fromPlatform = d.source_platform;
  let fromPlatformIcon;
  switch (d.source_platform) {
    case Platform.Discord: {
      fromPlatformIcon = DiscordColored;
      break;
    }
    case Platform.Telegram: {
      fromPlatformIcon = TelegramColored;
      break;
    }
    case "web":
    case Platform.Web: {
      fromPlatformIcon = WebSolid;
      break;
    }
    // case "app":
    // case Platform.App: {
    //   fromPlatformIcon = appLogo.src;
    //   break;
    // }
    default:
      break;
  }

  const where: Transaction["where"] = {
    text: "Unknown",
    avatar: "",
  };
  if (d.metadata) {
    try {
      // defaults for discord
      if (d.source_platform === Platform.Discord) {
        where.text = "Discord";
        where.avatar = DiscordColored;
      }

      // defaults for telegram
      if (d.source_platform === Platform.Telegram) {
        where.text = "Telegram";
        where.avatar = TelegramColored;
      }

      // get channel name
      if ("channel_name" in d.metadata && d.metadata.channel_name) {
        where.text = d.metadata.channel_name;
      }
      // get channel avatar
      if ("channel_avatar" in d.metadata && d.metadata.channel_avatar) {
        where.avatar = d.metadata.channel_avatar;
      }

      if ([Platform.Web, "web"].includes(d.source_platform)) {
        // hard-code for now
        // later tip widget could be used anywhere so need to get from api response
        where.text = d.metadata.channel_name || "beta.mochi.gg";
        // service to get any website's favicon
        where.avatar = `https://icon.horse/icon/${where.text}`;
        /* where.avatar = WebSolid as any */
      }

      const isSenderApp =
        "sender_profile_type" in d.metadata &&
        d.metadata.sender_profile_type === "application";
      const isReceiverApp =
        "recipient_profile_type" in d.metadata &&
        d.metadata.recipient_profile_type === "application";

      if (isSenderApp) {
        where.text = emojiStrip(
          (d.type === "in" ? to?.plain : from?.plain) ?? "App"
        );
        where.avatar = d.from_profile.application.avatar;

        fromAvatar = d.from_profile.application.avatar;
      }

      if (isReceiverApp) {
        where.text = emojiStrip(
          (d.type === "in" ? from?.plain : to?.plain) ?? "App"
        );
        where.avatar = d.other_profile.application.avatar;

        toAvatar = d.other_profile.application.avatar;
      }

      // get vault name (if it's a vault_transfer tx)
      if (isVault(d.from_profile_source) && "vault" in d.metadata) {
        const [newFrom] = UI.render(Platform.Web, d.metadata.vault);
        from = newFrom;
      }
      if (isVault(d.other_profile_source) && "vault" in d.metadata) {
        const [newTo] = UI.render(Platform.Web, d.metadata.vault);
        to = newTo;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // if (d.type === "in") {
  //   [from, to] = [to, from];
  //   [fromAvatar, toAvatar] = [toAvatar, fromAvatar];
  // }

  const toPlatform = to?.platform;
  let toPlatformIcon;
  switch (to?.platform) {
    case Platform.Discord: {
      toPlatformIcon = DiscordColored;
      break;
    }
    case Platform.Telegram: {
      toPlatformIcon = TelegramColored;
      break;
    }
    default:
      break;
  }

  if (from?.platform === Platform.Mochi) {
    from.plain = "🍡 Mochi user";
  }

  if (to?.platform === Platform.Mochi) {
    to.plain = "🍡 Mochi user";
  }

  // handle domain name when dealing with external addresses
  if (["withdraw", "deposit"].includes(d.type)) {
    let subject = to;
    // withdraw & deposit always target the other_profile
    const address = d.other_profile_source;
    const account = d.from_profile?.associated_accounts?.find(
      (aa: any) =>
        aa.platform_identifier.toLowerCase() === address.toLowerCase()
    );

    if (d.type === "deposit") {
      subject = from;
    }

    if (!account && subject) {
      subject.plain = d.other_profile_source;
    } else if (subject) {
      const domainName = mochiUtils.string.formatAddressUsername(account, 10);
      subject.plain = domainName;
      if (mochiUtils.address.isShorten(domainName)) {
        subject.plain = d.other_profile_source;
      }
      subject.plain ||= d.other_profile_source;
    }
  }

  const paycode = ["payme", "paylink"].includes(d.type) ? d.metadata.code : "";

  const siblingTxs = await Promise.all(
    (d.sibling_txs || []).map((d: any) => transform(d, token))
  );

  return {
    code: d.mochi_external_id,
    paycode,
    siblingTxs,
    from: {
      address: from?.plain ?? "?",
      avatar: fromAvatar,
      platform: fromPlatform,
      platformIcon: fromPlatformIcon,
    },
    to: {
      address: to?.plain ?? "?",
      avatar: toAvatar,
      platform: toPlatform,
      platformIcon: toPlatformIcon,
    },
    where,
    token,
    singleAmount: formatTokenDigit(d.amount),
    singleAmountUsd: formatTokenDigit(d.amount_in_usd),
    amount: formatTokenDigit(d.group_total_amount || d.amount),
    amountUsd: formatTokenDigit(d.group_total_usd || d.amount_in_usd),
    date: formatRelative(d.created_at),
    full_date: formatDate(d.created_at, "MMMM d, yyyy HH:mm:ss"),
    rawDate: d.created_at,
    status: d.status,
    action: d.type,
    originalTxId: d.original_tx_id,
    metadata: d.metadata,
  };
}
