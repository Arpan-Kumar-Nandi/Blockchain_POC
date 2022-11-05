import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://arpan:12345@cluster0.udfdtyn.mongodb.net/DMarketPlace?retryWrites=true&w=majority',
    ),
    UserModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
