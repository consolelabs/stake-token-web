import { API } from "@/constants/api";
import { create } from "zustand";

type LinkCommon = {
  primary_text: string;
  normal_text: string;
  secondary_text: string;
  thumbnail_url: string;
  background_image_url: string;
  border_color: string;
  scheduled_time: string;
};

type LinkLink = {
  type: "LINK";
  button: {
    color: string;
    title: string;
    url: string;
  };
  cta: null;
} & LinkCommon;

type LinkSocial = {
  type: "SOCIAL_MEDIA";
  button: {
    color: string;
    title: string;
    url: string;
  };
  cta: {
    state: string;
    text: string;
    background_color: string;
    url: string;
  };
} & LinkCommon;

type LinkEvent = {
  type: "EVENT";
  button: null;
  cta: {
    state: string;
    text: string;
    background_color: string;
    url: string;
  };
} & LinkCommon;

type LinkVideo = {
  type: "VIDEO";
  button: {
    color: string;
    title: string;
    url: string;
  };
  cta: {
    state: string;
    text: string;
    background_color: string;
    url: string;
  };
} & LinkCommon;

type LinkNote = {
  type: "NOTE";
  button: null;
  cta: {
    state: string;
    text: string;
    background_color: string;
    url: string;
  };
} & LinkCommon;

export type Link = LinkNote | LinkVideo | LinkEvent | LinkSocial | LinkLink;

type Bounty = {
  name: string;
  reward: number;
  expired: string;
  status: string;
};

interface State {
  data: null | {
    overview: {
      name: string;
      avatar: string;
      description: string;
      member_online: number;
      member: number;
      slug: string;
      background_image: string;
      is_verified: boolean;
      discord_url: string;
      created_at: string;
      about: {
        description: string;
        token: {
          name: string;
          symbol: string;
          chain: string;
          image: string;
          market_cap: number;
          price: number;
          max_supply: number;
          full_diluted_valuation: number;
          trading_volume_24h: number;
          change_h1: number;
          change_d1: number;
          change_w1: number;
          all_time_high: number;
          created_at: string;
        };
      };
    };
    links: Array<Link>;
    bounty: Array<Bounty>;
  };
  getInfo: (slug?: string) => Promise<void>;
  abort: () => void;
}

export const useServerInfo = create<State>((set) => ({
  data: null,
  abort: () => {},
  getInfo: async (slug = "dwarves") => {
    const [c, w] = API.TONO.get(`/guild_slugs/${slug}/info`).controller();
    set({
      abort: c.abort,
    });
    const res = await w.json((r) => r.data);
    set({
      data: res,
    });
  },
}));
