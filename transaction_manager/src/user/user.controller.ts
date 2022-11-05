import { JwtAuthGuard } from './../guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/finduser')
  async findUser(@Query('publicAddress') publicAddress) {
    const user = await this.userService.findUser(publicAddress);
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    console.log(body);
    const user = await this.userService.createUser(body);
    return user;
  }

  @Post('/signin')
  async login(@Body() body: LoginUserDto) {
    const jwtSignature = await this.userService.login(body);
    return jwtSignature;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout() {
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/balance')
  async getBalance(@CurrentUser() user: User) {
    const balance = await this.userService.fetchAccountBalance(
      user.publicAddress,
    );
    return balance;
  }
}
