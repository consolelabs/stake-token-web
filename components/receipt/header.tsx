import React, { SVGProps } from "react";
import { CheckLine, LinkLine, TipSolid } from "@mochi-ui/icons";
import TemplateComp, { type TemplateProps } from "./template";
import Image from "next/image";
import { Tooltip, Typography } from "@mochi-ui/core";
import { useClipboard } from "@dwarvesf/react-hooks";
import { isSSR } from "@dwarvesf/react-utils";

interface Props {
  template?: TemplateProps;
  platformIcon?: string | ((props: SVGProps<SVGSVGElement>) => JSX.Element);
  senderAvatar: string;
  code: string;
  title?: string;
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export default function Header({
  senderAvatar,
  platformIcon,
  template,
  code,
  title = "Tip",
  icon: Icon = TipSolid,
}: Props) {
  const { hasCopied, onCopy } = useClipboard(
    isSSR() ? "" : `${window.location.host}/tx/${code}`
  );

  return template ? (
    <TemplateComp
      {...template}
      platformIcon={platformIcon}
      avatar={senderAvatar}
    />
  ) : (
    <div className="flex overflow-hidden relative justify-between items-center p-4 h-[56px] bg-primary-solid">
      <Image fill src="/svg/wavy-pattern.svg" alt="wavy pattern" />
      <div className="flex relative gap-x-2">
        <Icon className="w-6 h-6 text-text-contrast" />
        <Typography className="p4" color="textContrast" fontWeight="md">
          {title}
        </Typography>
      </div>
      <Tooltip
        componentProps={{
          root: { open: hasCopied || undefined },
          trigger: { asChild: true },
        }}
        content={hasCopied ? "Copied!" : "Copy link"}
      >
        <button onClick={onCopy} type="button" className="outline-none">
          {hasCopied ? (
            <CheckLine className="relative w-4 h-4 text-text-contrast" />
          ) : (
            <LinkLine className="relative w-4 h-4 text-text-contrast" />
          )}
        </button>
      </Tooltip>
    </div>
  );
}
