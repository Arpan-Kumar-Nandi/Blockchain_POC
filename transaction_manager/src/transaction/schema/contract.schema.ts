import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContractDocument = Contract & Document;

@Schema()
export class Contract {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  contractAddress: string;

  @Prop({ require: true })
  mintedBy: string;

  @Prop()
  boughtBy: string[];
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
