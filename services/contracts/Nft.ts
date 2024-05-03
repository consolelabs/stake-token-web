import { ChainProvider } from "@mochi-web3/login-widget";
import { BigNumberish } from "ethers";
import { TokenAmount, formatTokenAmount } from "@/utils/number";
import { formatUnits } from "ethers/lib/utils";
import { ethers } from "ethers";
import { Nft__factory } from "@/abi/types";
import { BASE_PROVIDER_RPC, OPERATOR_WALLET_KEY } from "@/envs";
import wretch from "wretch";
import { NftData } from "@/store/nft-staking";

export const Abi = {
  Nft: '[{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"address","name":"initialOwner","type":"address"},{"internalType":"address","name":"_attributeAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721IncorrectOwner","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721InsufficientApproval","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC721InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"ERC721InvalidOperator","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721InvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC721InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC721InvalidSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721NonexistentToken","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_attributes","outputs":[{"internalType":"contract attributes","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBaseUri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getBoostStakingOfToken","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getDurationOfToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_itemId","type":"uint256"}],"name":"getItemAttribute","outputs":[{"components":[{"internalType":"uint8","name":"id","type":"uint8"},{"internalType":"uint8","name":"tier","type":"uint8"},{"internalType":"uint8","name":"rarity","type":"uint8"},{"internalType":"uint8","name":"quantity","type":"uint8"},{"internalType":"uint8","name":"boostStaking","type":"uint8"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"string","name":"consumables","type":"string"}],"internalType":"struct attributes.attribute","name":"_attribute","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMaxItemId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMintItemId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getTokenAttribute","outputs":[{"components":[{"internalType":"uint8","name":"id","type":"uint8"},{"internalType":"uint8","name":"tier","type":"uint8"},{"internalType":"uint8","name":"rarity","type":"uint8"},{"internalType":"uint8","name":"quantity","type":"uint8"},{"internalType":"uint8","name":"boostStaking","type":"uint8"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"string","name":"consumables","type":"string"}],"internalType":"struct attributes.attribute","name":"_attribute","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxItemId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minItemId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"_luckyWeight","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"randNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_attributeAddress","type":"address"}],"name":"setNewAttribute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operatorAddress","type":"address"}],"name":"setNewOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier1Weight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier2Weight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier3Weight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier4Weight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier5Weight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_itemId","type":"uint256"}],"name":"totalMaxSupplyOfItem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMaxSupplyOfItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMaxSupplyOfToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalQuantityOfItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
};

export const NftAddress = {
  NFT: "0x7C7669d98EC544c2a4Fe06fB1deD1E250E0Bb032",
};

export const LUCKY_POINT = 100;

export interface Attribute {
  id: number;
  tier: number;
  rarity: number;
  quantity: number;
  boostStaking: number;
  duration: number;
  icon: string;
  description: string;
}

export class NFT {
  private static instances: Map<string, NFT> = new Map();
  private provider: ChainProvider;
  private abi: string;
  private address: string;
  private operatorWalletKey: string;
  private sender: string = "";
  private baseProvider: string;

  private constructor(_abi: string, _provider: ChainProvider) {
    this.provider = _provider;
    this.abi = _abi;
    this.operatorWalletKey = OPERATOR_WALLET_KEY;
    this.address = NftAddress.NFT;
    this.baseProvider = BASE_PROVIDER_RPC;
  }

  setSenderAddress(address: string) {
    this.sender = address;
  }

  getAddress() {
    return this.address;
  }

  public static getInstance(_provider: ChainProvider): NFT {
    return new NFT(Abi.Nft, _provider);
  }
  getOperatorWalletKey() {
    return this.operatorWalletKey;
  }

  private getBigNumberValueByDecimals(
    value: BigNumberish,
    decimals: number
  ): TokenAmount {
    return formatTokenAmount(formatUnits(value, decimals));
  }

  async getTokenUri(tokenId: number): Promise<string> {
    try {
      const response: string = await this.provider.read({
        abi: this.abi,
        method: "tokenURI",
        args: [tokenId],
        to: this.address,
        from: this.sender,
      });

      return response[0];
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  async getTierWeight(): Promise<number[]> {
    try {
      const tiers = await Promise.all(
        [1, 2, 3, 4, 5].map((i) =>
          this.provider.read({
            abi: this.abi,
            method: `tier${i}Weight`,
            args: [],
            to: this.address,
            from: this.sender,
          })
        )
      );

      return tiers.map((tier) => Number(tier.toString()) / 10);
    } catch (error) {
      console.error(error);
      return [0.5, 2.5, 12, 35, 50];
    }
  }

  async getContractName(): Promise<string> {
    try {
      const response: string = await this.provider.read({
        abi: this.abi,
        method: "name",
        args: [],
        to: this.address,
        from: this.sender,
      });

      return response[0];
    } catch (error) {
      console.error(error);
      return "Dwarves";
    }
  }

  async getTokenAttribute(tokenId: number): Promise<Attribute> {
    try {
      const response: any = await this.provider.read({
        abi: this.abi,
        method: "getTokenAttribute",
        args: [tokenId],
        to: this.address,
        from: this.sender,
      });
      if (response) {
        return {
          id: response[0].id,
          tier: response[0].tier,
          rarity: response[0].rarity,
          quantity: response[0].quantity,
          duration: Number(response[0].duration.toString()),
          boostStaking: response[0].boostStaking,
          icon: "",
          description: "",
        };
      }
      return {
        id: 0,
        tier: 0,
        rarity: 0,
        quantity: 0,
        duration: 0,
        boostStaking: 0,
        icon: "",
        description: "",
      };
    } catch (error) {
      console.error(error);
      return {
        id: 0,
        tier: 0,
        rarity: 0,
        quantity: 0,
        duration: 0,
        boostStaking: 0,
        icon: "",
        description: "",
      };
    }
  }

  async listTokenIdOfWallet(): Promise<number[]> {
    try {
      const totalTokenSupply = await this.provider.read({
        abi: this.abi,
        method: "totalMaxSupplyOfToken",
        args: [],
        to: this.address,
        from: this.sender,
      });

      const listTokenId = await Promise.all(
        Array.from({ length: Number(totalTokenSupply.toString()) }, (_, i) =>
          this.provider.read({
            abi: this.abi,
            method: "ownerOf",
            args: [i + 1],
            to: this.address,
            from: this.sender,
          })
        )
      ).then((owners: string[]) =>
        owners.flatMap((owner, i) =>
          owner.toString().toLowerCase() == this.sender.toLowerCase()
            ? i + 1
            : []
        )
      );

      return listTokenId;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async mintNft(luckyPoint: number): Promise<string> {
    try {
      // connect to Base RPC Provider
      const bProvider = new ethers.providers.JsonRpcProvider(this.baseProvider);
      const operatorSigner = new ethers.Wallet(
        this.operatorWalletKey,
        bProvider
      );

      // instantiate StakingPoolFactory contract
      const nftContract = Nft__factory.connect(this.address, operatorSigner);

      const txs = await nftContract.mint(this.sender, luckyPoint);

      return txs.hash;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  async listItemNft(): Promise<NftData[]> {
    try {
      const baseUri: string = await this.provider.read({
        abi: this.abi,
        method: "getBaseUri",
        args: [],
        to: this.address,
        from: this.sender,
      });

      const minItemId = await this.provider.read({
        abi: this.abi,
        method: "getMintItemId",
        args: [],
        to: this.address,
        from: this.sender,
      });
      const maxItemId = await this.provider.read({
        abi: this.abi,
        method: "getMaxItemId",
        args: [],
        to: this.address,
        from: this.sender,
      });

      const items = await Promise.all(
        Array.from(
          {
            length:
              Number(maxItemId.toString()) - Number(minItemId.toString()) + 1,
          },
          (_, i) => i + 1
        ).map(async (id) => {
          const [{ name, image }, attributes, contractNames] =
            await Promise.all([
              wretch(baseUri + id.toString())
                .get()
                .json<{ name: string; image: string }>(),
              this.provider.read({
                abi: this.abi,
                method: "getItemAttribute",
                args: [id],
                to: this.address,
                from: this.sender,
              }),
              this.provider.read({
                abi: this.abi,
                method: "name",
                args: [],
                to: this.address,
                from: this.sender,
              }),
            ]);
          return {
            name,
            image,
            attribute: {
              ...attributes[0],
              duration: Number(attributes[0].duration.toString()),
            },
            contractName: contractNames[0],
          } as NftData;
        })
      );

      return items;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
