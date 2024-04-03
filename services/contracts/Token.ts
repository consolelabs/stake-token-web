import { TokenAmount, formatTokenAmount, getAmountWithDecimals } from "@/utils/number";
import { ChainProvider } from "@mochi-web3/connect-wallet-widget";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";

const Abi = {
  ICY: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"burnFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"subtractedValue\",\"type\":\"uint256\"}],\"name\":\"decreaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"addedValue\",\"type\":\"uint256\"}],\"name\":\"increaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
  DFG: "[]"
}

export const ERC20TokenInfo = {
  ICY: {
    address: "0xf289e3b222dd42b185b7e335fa3c5bd6d132441d",
    decimals: 18,
  },
  DFG: {
    address: "",
    decimals: 18,
  }
}

export type TokenType = "ICY" | "DFG";

export class ERC20TokenInteraction {
  private static instances: Map<string, ERC20TokenInteraction> = new Map();
  private provider: ChainProvider;
  private abi: string;
  private address: string;
  private decimals: number;
  private sender: string;

  private constructor(_abi: string, _address: string, _provider: ChainProvider, _decimals: number = 18) {
    this.provider = _provider;
    this.abi = _abi;
    this.address = _address;
    this.decimals = _decimals;
    this.sender = ""; // current connected wallet address
  }

  public static getInstance(type: TokenType, _provider: ChainProvider): ERC20TokenInteraction {
    if (!ERC20TokenInteraction.instances.has(type)) {
      if (type === "ICY") {
        ERC20TokenInteraction.instances.set(type, new ERC20TokenInteraction(Abi.ICY, ERC20TokenInfo.ICY.address, _provider));
      } else {
        ERC20TokenInteraction.instances.set(type, new ERC20TokenInteraction(Abi.DFG, ERC20TokenInfo.DFG.address, _provider));
      }
    }
    return ERC20TokenInteraction.instances.get(type)!;
  }

  setSenderAddress(address: string) {
    this.sender = address;
  }

  private getBigNumberValueByDecimals(value: BigNumberish): TokenAmount {
    return formatTokenAmount(formatUnits(value, this.decimals));
  }

  async getTokenBalance(): Promise<TokenAmount | undefined> {
    try {
      const response: BigNumber[] = await this.provider.read({ 
        abi: this.abi, 
        method: "balanceOf", 
        args: [this.sender],
        to: this.address,
        from: this.sender,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        return this.getBigNumberValueByDecimals(response[0].toBigInt());
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getAllowance(spenderAddress: string): Promise<TokenAmount | undefined> {
    try {
      const response: [BigNumber] = await this.provider.read({ 
        abi: this.abi, 
        method: "allowance", 
        args: [this.sender, spenderAddress],
        to: this.address,
        from: this.sender,
      });

      if (response?.length && BigNumber.isBigNumber(response[0])) {
        return this.getBigNumberValueByDecimals(response[0].toBigInt());
      }
    } catch (error) {
      console.error("error when trying to get allowance: ", error);
      return;
    }
  }

  async approveTokenAmount(spenderAddress: string, amount: number) {
    try {
      const amountWithDecimals = getAmountWithDecimals(amount, this.decimals).toString();
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
