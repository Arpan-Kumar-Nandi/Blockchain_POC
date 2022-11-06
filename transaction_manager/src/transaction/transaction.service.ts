import { Contract, ContractDocument } from './schema/contract.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Web3Util from '../utils/Web3Utils';

@Injectable()
export class TransactionService {
  private readonly web3Util = new Web3Util();

  constructor(
    @InjectModel(Contract.name)
    private readonly contractModel: Model<ContractDocument>,
  ) {}

  async mintPOC20Tokens(exchangeRate: number, publicAddress: string) {
    const deployedContract = await this.web3Util.mintPOC20Tokens(
      exchangeRate,
      publicAddress,
    );
    let name = await deployedContract.methods.name().call();
    name = name.split(' ')[0];
    const contractAddress = deployedContract.options.address;

    const contract = await this.contractModel.create({
      name,
      contractAddress,
      mintedBy: publicAddress,
    });
    return contract;
  }

  async fetchDeployedContractsToBuyFrom(publicAddress: string) {
    const listOfContractsToBuyFrom = await this.contractModel.find({
      mintedBy: { $ne: publicAddress },
    });

    let includeContractBalance = [];

    for (const contract of listOfContractsToBuyFrom) {
      const { balance, exchangeRate } =
        await this.web3Util.getPOC20ContractBalance(contract.contractAddress);
      includeContractBalance.push({ contract, balance, exchangeRate });
    }
    return includeContractBalance;
  }

  async buyPOC20Tokens(publicAddress: string, amountInEther: string) {
    return this.web3Util.buyPOC20Tokens(publicAddress, amountInEther);
  }
}
