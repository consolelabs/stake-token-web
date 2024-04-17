import { Token } from "@/store/token-staking";
import { getAmountWithDecimals } from "@/utils/number";
import { ChainProvider } from "@mochi-web3/login-widget";
import { BigNumber } from "ethers";

export class ERC20TokenInteraction {
  private static instances: Map<string, ERC20TokenInteraction> = new Map();
  private provider: ChainProvider;
  private name: string;
  private symbol: string;
  private abi: string;
  private address: string;
  private decimals: number;
  private sender: string;

  private constructor(_name: string, _symbol: string, _abi: string, _address: string, _decimals: number, _provider: ChainProvider) {
    this.name = _name;
    this.symbol = _symbol;
    this.provider = _provider;
    this.abi = _abi;
    this.address = _address;
    this.decimals = _decimals;
    this.sender = ""; // current connected wallet address
  }

  public static getInstance(token: Token, _provider: ChainProvider): ERC20TokenInteraction | undefined {
    const { token_address, token_decimal, token_name, token_symbol, token_abi } = token;
    if (!token_address || !token_decimal || !token_name || !token_symbol || !token_abi) return;
    if (!ERC20TokenInteraction.instances.has(token_symbol)) {
      ERC20TokenInteraction.instances.set(token_symbol, new ERC20TokenInteraction(token_name, token_symbol, token_abi, token_address, token_decimal, _provider));
    }
    return ERC20TokenInteraction.instances.get(token_symbol)!;
  }

  setChainProvider(provider: ChainProvider) {
    this.provider = provider;
  }

  setSenderAddress(address: string) {
    this.sender = address;
  }

  async getTokenBalance(): Promise<BigNumber | undefined> {
    try {
      const response: BigNumber[] = await this.provider.read({ 
        abi: this.abi, 
        method: "balanceOf", 
        args: [this.sender],
        to: this.address,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        console.log("getTokenBalance: ", response[0].toString());
        return response[0];
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getAllowance(spenderAddress: string): Promise<BigNumber | undefined> {
    try {
      const response: [BigNumber] = await this.provider.read({ 
        abi: this.abi, 
        method: "allowance", 
        args: [this.sender, spenderAddress],
        to: this.address,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        console.log("getAllowance: ", response[0].toString());
        return response[0];
      }
    } catch (error) {
      console.error("error when trying to get allowance: ", error);
      return;
    }
  }

  async approveTokenAmount(spenderAddress: string, amount: number) {
    try {
      const amountWithDecimals = getAmountWithDecimals(amount, this.decimals);
      const txHash = await this.provider.write({ 
        abi: this.abi, 
        method: "approve", 
        args: [spenderAddress, amountWithDecimals],
        to: this.address,
        from: this.sender,
      });
      if (txHash) return txHash;
      console.log("approve tx_hash = ", txHash);
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
