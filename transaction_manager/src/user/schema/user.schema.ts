import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  nonce: number;

  @Prop({ required: true, unique: true })
  publicAddress: string;

  // @Prop({ required: true })
  // privateKey: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
