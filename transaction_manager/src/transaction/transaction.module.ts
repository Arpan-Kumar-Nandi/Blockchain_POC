import { Contract, ContractSchema } from './schema/contract.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [MongooseModule],
})
export class TransactionModule {}
