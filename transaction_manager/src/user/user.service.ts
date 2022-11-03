import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Web3Util from 'src/utils/Web3Utils';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  private readonly web3Util = new Web3Util();
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(credentials: CreateUserDto) {
    const user = await this.userModel.create(credentials);
    user.password = undefined;
    return user;
  }

  async signInUser({ id, password }: LoginUserDto) {
    const user = await this.userModel.findById(id).select('+password');
    if (!user) throw new NotFoundException('User not found');

    if (user.password !== password) {
      throw new BadRequestException('Incorrect password');
    }

    // const web3Util = new Web3Util();
    // web3Util.fetchAccounts();
    // web3Util.getBalance(user.accountAddress);
    user.password = undefined;
    return user;
  }

  async findUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async fetchAccountBalance(address: string) {
    return this.web3Util.getBalance(address);
  }
}
