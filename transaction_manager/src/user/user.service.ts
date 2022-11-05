import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonUtils } from '../utils/CommonUtils';
import Web3Util from '../utils/Web3Utils';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly web3Util = new Web3Util();
  private readonly commonUtils = new CommonUtils();
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(credentials: CreateUserDto) {
    const nonce = this.commonUtils.generateNonce();
    Object.assign(credentials, { nonce });
    const user = await this.userModel.create(credentials);
    return user;
  }

  async login({ publicAddress, signature }: LoginUserDto) {
    const user = await this.userModel.findOne({ publicAddress });
    if (!user) {
      throw new NotFoundException('User not found with this public address');
    }

    const msg = `I am signing my one-time nonce: ${user.nonce}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      signature,
    });
    if (address.toLowerCase() === publicAddress.toLowerCase()) {
      user.nonce = this.commonUtils.generateNonce();
      await user.save();
      const payload = { id: user.id, publicAddress: user.publicAddress };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Signature verification failed');
    }
  }

  async findUser(publicAddress) {
    if (!publicAddress)
      throw new NotFoundException('Logged out, Please log in again');
    const user = await this.userModel.findOne({ publicAddress });
    if (!user) return null;
    return user;
  }

  async fetchAccountBalance(address: string) {
    return this.web3Util.getBalance(address);
  }
}
