import { Attribute, NFT } from "@/services";
import { ChainProvider } from "@mochi-web3/login-widget";
import { create } from "zustand";
import wretch from "wretch";

export interface NftData {
  tokenId: number;
  name?: string;
  image?: string;
  attribute?: Attribute;
  contractName?: string;
}

interface State {
  nftContract: NFT | null;
  nftData: NftData[];
}

interface Action {
  reset: () => void;
  setValues: (values: Partial<State>) => void;
  initializeContract: (address: string, provider: ChainProvider) => void;
  initializeNFTData: () => Promise<void>;
}

const initialState: State = {
  nftContract: null,
  nftData: [],
};

export const useNFTStaking = create<State & Action>((set, get) => ({
  ...initialState,
  reset: () => {
    set(initialState);
  },
  setValues: (values) => set((state) => ({ ...state, ...values })),
  initializeContract: (address, provider) => {
    const nftContract = NFT.getInstance(provider);
    if (!nftContract) return;
    nftContract.setSenderAddress(address);
    get().setValues({ nftContract });
  },
  initializeNFTData: async () => {
    const { nftContract } = get();
    if (!nftContract) return;
    const tokenIds = await nftContract.listTokenIdOfWallet();
    const getNftData = await Promise.allSettled(
      tokenIds.map(async (tokenId) => {
        const attribute = await nftContract.getTokenAttribute(tokenId);
        const contractName = await nftContract.getContractName();
        const uri = await nftContract.getTokenUri(tokenId);
        const { name, image } = await wretch(uri)
          .get()
          .json<{ name?: string; image?: string }>();
        return { tokenId, name, image, attribute, contractName };
      })
    );
    const nftData = getNftData.map((r, index) =>
      r.status === "fulfilled" ? r.value : { tokenId: tokenIds[index] }
    );
    get().setValues({ nftData });
  },
}));
