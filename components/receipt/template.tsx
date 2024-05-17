import { Avatar } from "@mochi-ui/core";
import Image from "next/image";
import { SVGProps } from "react";

export type TemplateName =
  | "happy_birthday"
  | "appreciation"
  | "achievement"
  | "anniversary";

export type TemplateProps = { img: string; phrase: string; title: string };

export const templates: Record<TemplateName, TemplateProps> = {
  happy_birthday: {
    phrase: "sent a birthday gift",
    img: "/tx/hpbd.png",
    title: "Happy Birthday ⎯ Tip from <user> ⎯ Mochi",
  },
  appreciation: {
    phrase: "sent a thank you gift",
    img: "/tx/appreciation.png",
    title: "Thank You ⎯ Tip from <user> ⎯ Mochi",
  },
  achievement: {
    phrase: "sent a gift to celebrate the achievement",
    img: "/tx/achievement.png",
    title: "Celebrate Achievement ⎯ Tip from <user> ⎯ Mochi",
  },
  anniversary: {
    phrase: "sent an anniversary gift",
    img: "/tx/wedding.png",
    title: "Happy Anniversary ⎯ Tip from <user> ⎯ Mochi",
  },
};

interface Props extends TemplateProps {
  platformIcon?: string | ((props: SVGProps<SVGSVGElement>) => JSX.Element);
  avatar: string;
}

export default function Template({ title, img, avatar, platformIcon }: Props) {
  return (
    <div className="relative w-full bg-inherit h-[200px]">
      <Image
        src={img}
        fill
        className="object-cover object-bottom"
        alt={title}
      />
      <div className="absolute bottom-0 left-1/2 p-1 rounded-full -translate-x-1/2 translate-y-1/2 bg-inherit">
        <Avatar size="3xl" src={avatar} smallSrc={platformIcon} />
      </div>
    </div>
  );
}
