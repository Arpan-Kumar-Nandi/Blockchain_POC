import Web3 from 'web3';
import { AbiItem, fromWei, toWei } from 'web3-utils';
import POC20 from '../contracts/POC20.json';

export default class Web3Util {
  private readonly web3 = new Web3('http://127.0.0.1:7545');
  private readonly networkID = 5777;

  async fetchAccounts() {
    this.web3.eth.getAccounts();
  }

  async poc20() {
    return new this.web3.eth.Contract(
      POC20.abi as AbiItem[],
      '0x104480c1d962F2825BB053a6D7f28DE6c3bEF91b',
    );
  }

  async mintPOC20Tokens(publicAddress: string) {
    const deployedContract = await new this.web3.eth.Contract(
      POC20.abi as AbiItem[],
    )
      .deploy({ data: POC20.bytecode })
      .send({ gas: 1500000, from: publicAddress });

    console.log(deployedContract.options.address);
  }

  async getPOC20Balance(publicAddress: string) {
    const poc20 = await this.poc20();
    const balance = await poc20.methods.balanceOf(publicAddress).call();
    const balanceinEther = fromWei(balance, 'ether');
    return balanceinEther;
  }

  async buyPOC20Tokens(accountAddress: string, amountInEther: string) {
    const poc20 = await this.poc20();
    try {
      await poc20.methods
        .buyTokens()
        .send({
          from: accountAddress,
          value: toWei(amountInEther, 'ether'),
        })
        .on('Transfer', () => {
          console.log('here');
        });

      const tokens = await poc20.methods.balanceOf(accountAddress).call();
      console.log('here', tokens);
    } catch (err) {
      console.log(err);
    }
  }
}
