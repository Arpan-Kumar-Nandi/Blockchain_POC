import { UserService } from './user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'abcdefghijklmnopqrstuvwxyz',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUser(payload.publicAddress);
    // const balance = await this.userService.getPOC20Balance(
    //   payload.publicAddress,
    // );
    // // Object.assign(user, { poc20Balance: balance });
    // const setUser = { ...user, poc20Balance: balance };
    return user;
  }
}
