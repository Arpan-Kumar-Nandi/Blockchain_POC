import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NFT721Document = NFT721 & Document;

@Schema()
export class NFT721 {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  contractAddress: string;

  @Prop({ require: true })
  owner: string;

  @Prop({ require: true, unique: true })
  tokenId: string;
}

export const NFT721Schema = SchemaFactory.createForClass(NFT721);
