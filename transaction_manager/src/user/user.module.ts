import { JwtStrategy } from './jwt.stragety';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  Contract,
  ContractSchema,
} from '../transaction/schema/contract.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Contract.name, schema: ContractSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'abcdefghijklmnopqrstuvwxyz',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [MongooseModule],
})
export class UserModule {}
