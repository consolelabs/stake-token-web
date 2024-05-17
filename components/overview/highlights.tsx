import { Link, useServerInfo } from "@/store/server-info";
import {
  Button,
  TabContent,
  TabList,
  TabTrigger,
  Tabs,
  Typography,
} from "@mochi-ui/core";
import Image from "next/image";
import Color from "color";
import {
  UserSolid,
  CalendarLine,
  BellSolid,
  ArrowTopRightLine,
  BinocularSolid,
  DollarSquareSolid,
  TrophySolid,
} from "@mochi-ui/icons";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import { Transactions } from "./transactions";
import { useState } from "react";
import { About } from "./about";
import { BountyTable } from "./bounty-table";
import ChartColumn from "@/public/svg/chart-column.svg";
dayjs.extend(utc);
dayjs.extend(advancedFormat);

function LinkCard(props: Extract<Link, { type: "LINK" }>) {
  const dominantColor = Color(props.border_color);
  const btnColor = Color(props.button.color);

  return (
    <div
      className="flex relative flex-col gap-y-3 items-start p-6 rounded-xl border"
      style={{
        borderColor: props.border_color,
        background: `linear-gradient(${dominantColor
          .alpha(0.15)
          .hexa()}, transparent)`,
      }}
    >
      <img
        src={props.background_image_url}
        className="absolute top-0 right-0 h-full opacity-50"
        alt=""
      />
      <Image
        className="w-10 h-10 rounded-lg aspect-square"
        width={40}
        height={40}
        src={props.thumbnail_url}
        alt=""
      />
      <div className="flex flex-col">
        <Typography className="font-semibold">{props.primary_text}</Typography>
        <Typography level="p6" color="neutral" className="font-light">
          {props.secondary_text}
        </Typography>
      </div>

      <Button
        style={{
          borderRadius: "99999px",
          backgroundColor: btnColor.hexa(),
          color: btnColor.isDark() ? "white" : "black",
        }}
        size="sm"
      >
        {props.button.title}
      </Button>
    </div>
  );
}

function SocialCard(props: Extract<Link, { type: "SOCIAL_MEDIA" }>) {
  const dominantColor = Color(props.border_color);
  const btnColor = Color(props.button.color);
  const ctaColor = Color(props.cta.background_color);

  return (
    <div
      className="flex relative flex-col gap-y-3 items-start p-6 rounded-xl border"
      style={{
        borderColor: props.border_color,
        background: `linear-gradient(${dominantColor
          .alpha(0.15)
          .hexa()}, transparent)`,
      }}
    >
      <img
        src={props.background_image_url}
        className="absolute top-0 right-0 h-full opacity-50"
        alt=""
      />
      <div className="flex justify-between items-start w-full">
        <Image
          className="w-10 h-10 rounded-lg aspect-square"
          width={40}
          height={40}
          src={props.thumbnail_url}
          alt=""
        />
        <div
          className="flex gap-x-0.5 items-center py-1 px-2 rounded-full"
          style={{
            backgroundColor: ctaColor.hexa(),
            color: ctaColor.isDark() ? "white" : "black",
          }}
        >
          <UserSolid className="w-3 h-3" />
          <p
            className="text-xs"
            style={{
              color: ctaColor.isDark() ? "white" : "black",
            }}
          >
            {props.cta.text}
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <Typography className="font-semibold">{props.primary_text}</Typography>
        <Typography level="p6" color="neutral" className="font-light">
          {props.secondary_text}
        </Typography>
      </div>

      <Button
        style={{
          borderRadius: "99999px",
          backgroundColor: btnColor.hexa(),
          color: btnColor.isDark() ? "white" : "black",
        }}
        size="sm"
      >
        {props.button.title}
      </Button>
    </div>
  );
}

function EventCard(props: Extract<Link, { type: "EVENT" }>) {
  const time = dayjs(props.scheduled_time).utc(true);

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl">
      <div className="flex justify-between items-start">
        <Image
          width={40}
          height={40}
          className="w-10 h-10 rounded-lg aspect-square"
          src={props.thumbnail_url}
          alt=""
        />
        <Button
          color="neutral"
          size="sm"
          variant="soft"
          className="rounded-full text-neutral-400"
        >
          <BellSolid />
          {props.cta.text}
        </Button>
      </div>
      <div className="flex flex-col gap-y-1 mt-auto">
        <div className="flex gap-x-1 items-center">
          <CalendarLine className="w-4 h-4 text-neutral-solid" />
          <Typography level="p5" className="font-semibold text-neutral-solid">
            {time.local().format("dddd MMM Do - h:mm A")}
          </Typography>
        </div>
        <Typography className="font-semibold">{props.primary_text}</Typography>
        <Typography level="p6" color="neutral" className="font-light truncate">
          {props.secondary_text}
        </Typography>
      </div>
    </div>
  );
}

function VideoCard(props: Extract<Link, { type: "VIDEO" }>) {
  const overlay = Color("black").alpha(0.6);

  return (
    <div
      className="flex overflow-hidden relative flex-col justify-between p-6 rounded-xl"
      style={{
        backgroundImage: `url(${props.background_image_url})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundOrigin: "center center",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ background: overlay.hexa() }}
      />
      <div className="relative self-end p-1 text-white rounded-full border border-white">
        <ArrowTopRightLine />
      </div>
      <Typography className="relative font-light text-white" level="p6">
        {props.primary_text}
      </Typography>
    </div>
  );
}

function NoteCard(props: Extract<Link, { type: "NOTE" }>) {
  return (
    <div className="flex overflow-hidden flex-col justify-between p-6 bg-white rounded-xl">
      <div className="flex justify-between items-start">
        <Typography className="font-semibold">{props.primary_text}</Typography>
        <div className="self-end p-1 text-white rounded-full border border-white bg-neutral-outline-border">
          <ArrowTopRightLine className="text-white" />
        </div>
      </div>
      <q className="text-sm font-light">{props.normal_text}</q>
    </div>
  );
}

export function Highlights() {
  const { data } = useServerInfo();
  const [selectedtab, setSelectedTab] = useState("home");

  return (
    <>
      <Tabs value={selectedtab} onValueChange={setSelectedTab} className="py-6">
        <TabList className="[&>div>button]:px-4 [&>div>button]:py-1.5 [&>div>button]:rounded-lg [&>div>button[data-state=active]]:bg-background-level3 [&>div>button[data-state=active]]:text-text-primary">
          <TabTrigger value="home">
            <BinocularSolid />
            Home
          </TabTrigger>
          <TabTrigger value="token">
            <DollarSquareSolid />
            Token
          </TabTrigger>
          <TabTrigger value="bounty">
            <TrophySolid />
            Bounty
          </TabTrigger>
          <TabTrigger value="transaction">
            <ChartColumn />
            Transaction
          </TabTrigger>
        </TabList>
        <div className="py-6">
          <TabContent
            value="home"
            className="grid grid-cols-3 grid-rows-2 gap-4"
          >
            {data?.links.map((l, i) => {
              let Card: (args: any) => JSX.Element = () => <></>;
              switch (l.type) {
                case "LINK":
                  Card = LinkCard;
                  break;
                case "SOCIAL_MEDIA":
                  Card = SocialCard;
                  break;
                case "EVENT":
                  Card = EventCard;
                  break;
                case "VIDEO":
                  Card = VideoCard;
                  break;
                case "NOTE":
                  Card = NoteCard;
                  break;
                default:
                  break;
              }

              return <Card key={`${i}-${l.type}`} {...l} />;
            })}
          </TabContent>
          <TabContent value="token">token</TabContent>
          <TabContent value="bounty">bounty</TabContent>
          <TabContent value="transaction">
            <Transactions />
          </TabContent>
        </div>
      </Tabs>
      {selectedtab !== "transaction" && (
        <>
          <About />
          <BountyTable />
        </>
      )}
    </>
  );
}
