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
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/mintPOC20Tokens')
  async mintPOC20Tokens(@Request() req) {
    return this.transactionService.mintPOC20Tokens(req.user.publicAddress);
  }

  @Get('/fetchDeployedContractsToBuyFrom')
  async fetchDeployedContractsToBuyFrom(@Request() req) {
    return this.transactionService.fetchDeployedContractsToBuyFrom(
      req.user.publicAddress,
    );
  }

  @Post('/buyPOC20Tokens')
  async buyPOC20Tokens(@Body() body, @Request() req) {
    await this.transactionService.buyPOC20Tokens(
      req.user.publicAddress,
      body.amountInEther,
    );
  }
}
