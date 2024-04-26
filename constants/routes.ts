export const ROUTES = {
  HOME: "/",
  OVERVIEW: "/dwarves",
  OVERVIEW_NFT: (server: string) => `/${server}?${PARAMS.OVERVIEW.NFT}`,
  NFT: (server: string) => `/${server}/nft`,
};

export const PARAMS = {
  OVERVIEW: {
    NFT: "nft",
  },
};
