import { Injectable } from '@nestjs/common';
import Web3Util from '../utils/Web3Utils';

@Injectable()
export class TransactionService {
  private readonly web3Util = new Web3Util();

  async buyPOC20Tokens(accountAddress: string, amountInEther: string) {
    return this.web3Util.buyPOC20Tokens(accountAddress, amountInEther);
  }
}
