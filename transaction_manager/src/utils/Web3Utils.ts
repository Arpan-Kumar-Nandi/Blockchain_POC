import Web3 from 'web3';
import { AbiItem, fromWei, toWei } from 'web3-utils';
import POC20 from '../contracts/POC20.json';

export default class Web3Util {
  private readonly web3 = new Web3('http://127.0.0.1:7545');
  private readonly networkID = 5777;

  async fetchAccounts() {
    this.web3.eth.getAccounts();
  }

  async poc20(contractAddress: string) {
    return new this.web3.eth.Contract(POC20.abi as AbiItem[], contractAddress);
  }

  async mintPOC20Tokens(exchangeRate: number, publicAddress: string) {
    const deployedContract = await new this.web3.eth.Contract(
      POC20.abi as AbiItem[],
    )
      .deploy({ data: POC20.bytecode, arguments: [exchangeRate] })
      .send({ gas: 1500000, from: publicAddress });

    return deployedContract;
  }

  async getPOC20Balance(publicAddress: string, contractAddress: string) {
    const poc20 = await this.poc20(contractAddress);
    const balance = await poc20.methods.balanceOf(publicAddress).call();
    const balanceinEther = fromWei(balance, 'ether');
    return parseFloat(balanceinEther);
  }

  async getPOC20ContractBalance(contractAddress: string) {
    const poc20 = await this.poc20(contractAddress);
    const balance = await poc20.methods.getBalance().call();
    const balanceinEther = fromWei(balance, 'ether');

    const exchangeRate = await poc20.methods.tokensPerUnitEther().call();

    return { balance: parseFloat(balanceinEther), exchangeRate };
  }

  async buyPOC20Tokens(
    contractAddress: string,
    publicAddress: string,
    ethersToSpend: number,
  ) {
    const poc20 = await this.poc20(contractAddress);
    try {
      const status = await poc20.methods.buyTokens().send({
        from: publicAddress,
        value: toWei(ethersToSpend.toString(), 'ether'),
      });
      return status;
    } catch (err) {
      console.log(err);
    }
  }
}
