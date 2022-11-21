import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { NFT721Contract } from './dto/NFT721Contract.dto';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Post('/buyPOC20Tokens')
  // async buyPOC20Tokens(@Body() body, @Request() req) {
  //   return this.transactionService.buyPOC20Tokens(
  //     req.user.publicAddress,
  //     body.ethersToSpend,
  //   );
  // }

  @Get('/generateNFTToken')
  createNFTToken() {
    return this.transactionService.generateNFTToken();
  }

  @Post('/createNFT')
  async createNFT(@Body() body: NFT721Contract, @Request() req) {
    return this.transactionService.createNFT(body);
  }

  @Get('/fetchMyNFTS')
  async fetchMyNFTS(@Request() req) {
    return this.transactionService.fetchMyNFTS(req.user.publicAddress);
  }

  @Get('/fetchAllItems')
  async fetchAllItems(@Request() req) {
    return this.transactionService.fetchAllItems();
  }

  @Post('/buyNFTToken')
  async buyNFTToken(@Body() body, @Request() req) {
    return this.transactionService.buyNFTToken(
      body.contractAddress,
      req.user.publicAddress,
    );
  }
  @Post('/resellNFTToken')
  async resellNFTToken(@Body() body, @Request() req) {
    return this.transactionService.resellNFTToken(
      body.contractAddress,
      body.tokenId,
      body.price,
      req.user.publicAddress,
    );
  }
  @Post('/fetchNFTItemDetails')
  async fetchNFTItemDetails(@Body() body) {
    return this.transactionService.fetchNFTItemDetails(
      body.contractAddress,
      body.tokenId,
    );
  }
}
