import { JwtAuthGuard } from './../guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/finduser')
  async findUser(@Query('publicAddress') publicAddress) {
    return this.userService.findUser(publicAddress);
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Post('/signin')
  async login(@Body() body: LoginUserDto) {
    return this.userService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getpoc20balance')
  async getPOC20Balance(@Request() req) {
    return this.userService.getPOC20Balance(req.user.publicAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout() {
    return;
  }
}
