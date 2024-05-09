export const ROUTES = {
  HOME: "/",
  OVERVIEW: "/dwarves",
  NFT: (server: string) => `/${server}/nft`,
  EARN: (server: string) => `/${server}/earn`,
};

export const PARAMS = {
  OVERVIEW: {
    NFT: "nft",
  },
};
