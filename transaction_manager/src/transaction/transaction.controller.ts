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
import { ProductDetailsBody } from './dto/productDetailsBody.dto';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/buyPOC20Tokens')
  async buyPOC20Tokens(@Body() body, @Request() req) {
    return this.transactionService.buyPOC20Tokens(
      req.user.publicAddress,
      body.ethersToSpend,
    );
  }

  @Post('/createNFT')
  async createNFT(@Body() body: ProductDetailsBody, @Request() req) {
    return this.transactionService.createNFT(req.user.publicAddress, body);
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
      body.tokenId,
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
