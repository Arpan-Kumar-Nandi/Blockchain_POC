import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/mintPOC20Tokens')
  async mintPOC20Tokens(@Query('publicAddress') publicAddress) {
    await this.transactionService.mintPOC20Tokens(publicAddress);
  }

  @Post('/buyPOC20Tokens')
  async buyPOC20Tokens(@Body() body, @CurrentUser() user) {
    await this.transactionService.buyPOC20Tokens(
      user.accountAddress,
      body.amountInEther,
    );
  }
}
