import { NFT721, NFT721Schema } from './schema/NFT721.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NFT721.name, schema: NFT721Schema }]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [MongooseModule],
})
export class TransactionModule {}
