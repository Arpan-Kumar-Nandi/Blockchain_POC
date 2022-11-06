import { Injectable } from '@nestjs/common';
import Web3Util from '../utils/Web3Utils';

@Injectable()
export class TransactionService {
  private readonly web3Util = new Web3Util();

  async mintPOC20Tokens(publicAddress: string) {
    return this.web3Util.mintPOC20Tokens(publicAddress);
  }

  async buyPOC20Tokens(publicAddress: string, amountInEther: string) {
    return this.web3Util.buyPOC20Tokens(publicAddress, amountInEther);
  }
}
