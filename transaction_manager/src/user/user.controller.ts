import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.userService.createUser(body);
    session.userId = user['_id'];
    return user;
  }

  @Post('/signin')
  async login(@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.userService.signInUser(body);
    session.userId = user['_id'];
    return user;
  }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/balance')
  async getBalance(@CurrentUser() user: User) {
    const balance = await this.userService.fetchAccountBalance(
      user.accountAddress,
    );
    return balance;
  }
}
