import { NFT721, NFT721Document } from './schema/NFT721.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommonUtils } from '../utils/CommonUtils';
import Web3Util from '../utils/Web3Utils';
import { ProductDetailsBody } from './dto/productDetailsBody.dto';
import { ProductDetailsSmartContractDeploy } from './dto/productDetailsSmartContractDeploy.dto';
import { Model } from 'mongoose';
import { fromWei, toWei } from 'web3-utils';
@Injectable()
export class TransactionService {
  private readonly web3Util = new Web3Util();
  private readonly commonUtils = new CommonUtils();

  constructor(
    @InjectModel(NFT721.name)
    private readonly nft721model: Model<NFT721Document>,
  ) {}

  async buyPOC20Tokens(publicAddress: string, ethersToSpend: number) {
    return this.web3Util.buyPOC20Tokens(publicAddress, ethersToSpend);
  }

  async createNFT(publicAddress: string, productDetails: ProductDetailsBody) {
    // uint tokenId, string memory title, string memory description, uint price, string memory date, address POC20Address
    const tokenId = this.commonUtils.generateTokenId();
    const date = new Date().toDateString();

    const productDetailsForSmartContract: ProductDetailsSmartContractDeploy = {
      ...productDetails,
      tokenId,
      date,
      address: '0x85860320dE6Df0D9Bb9B6AC667D82Aa90Aee25C1',
    };

    const deployedContract = await this.web3Util.createNFT(
      publicAddress,
      productDetailsForSmartContract,
    );

    let name = await deployedContract.methods.name().call();
    name = name.split(' ')[0];

    const contractAddress = deployedContract.options.address;

    const contract = await this.nft721model.create({
      name,
      contractAddress,
      owner: publicAddress,
      tokenId,
    });

    return contract;
  }

  async fetchMyNFTS(publicAddress: string) {
    const nfts = await this.nft721model.find({ owner: publicAddress });
    let nftDetails = [];
    for (const nft of nfts) {
      const { itemDetails } = await this.web3Util.fetchNFTDetails(
        nft.contractAddress,
        parseInt(nft.tokenId),
      );
      itemDetails.contractAddress = nft.contractAddress;
      itemDetails.price = fromWei(itemDetails.price, 'ether');
      nftDetails.push(itemDetails);
    }
    return nftDetails;
  }

  async fetchAllItems() {
    const nfts = await this.nft721model.find({});
    let nftDetails = [];
    for (const nft of nfts) {
      const { itemDetails } = await this.web3Util.fetchNFTDetails(
        nft.contractAddress,
        parseInt(nft.tokenId),
      );
      itemDetails.contractAddress = nft.contractAddress;
      itemDetails.price = fromWei(itemDetails.price, 'ether');
      nftDetails.push(itemDetails);
    }
    return nftDetails;
  }

  async buyNFTToken(contractAddress, tokenId, publicAddress) {
    try {
      const transaction = await this.web3Util.buyNFTToken(
        contractAddress,
        parseInt(tokenId),
        publicAddress,
      );
      const nft = await this.nft721model.findOne({ contractAddress });
      nft.owner = publicAddress;
      nft.save();
      return transaction;
    } catch (err) {
      console.log(err);
    }
  }
  async resellNFTToken(contractAddress, tokenId, price, publicAddress) {
    try {
      const transaction = await this.web3Util.resellNFTToken(
        contractAddress,
        parseInt(tokenId),
        price.toString(),
        publicAddress,
      );
      return transaction;
    } catch (err) {
      console.log(err);
    }
  }
  async fetchNFTItemDetails(contractAddress, tokenId) {
    let { itemDetails, itemOwnerHistory, itemPriceHistory } =
      await this.web3Util.fetchNFTDetails(contractAddress, parseInt(tokenId));

    itemDetails.contractAddress = contractAddress;
    itemDetails.price = fromWei(itemDetails.price, 'ether');

    itemPriceHistory = itemPriceHistory.map((item) =>
      fromWei(item.toString(), 'ether'),
    );

    const details = {
      ...itemDetails,
      itemOwnerHistory,
      itemPriceHistory,
    };
    return details;
  }
}
