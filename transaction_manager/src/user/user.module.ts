import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('User middleware');
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
