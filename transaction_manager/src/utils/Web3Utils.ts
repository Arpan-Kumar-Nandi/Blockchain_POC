import Web3 from 'web3';
import POC20 from '../../../build/contracts/POC20.json';

export default class Web3Util {
  private readonly web3 = new Web3('http://127.0.0.1:7545');

  async fetchAccounts() {
    this.web3.eth.getAccounts();
  }

  async getBalance(address: string) {
    return this.web3.eth.getBalance(address);
  }

  async buyPOC20Tokens(accountAddress: string, amount: number) {}
}
