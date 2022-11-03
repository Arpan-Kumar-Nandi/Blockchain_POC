import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../user.service';
import { Request, Response, NextFunction } from 'express';
import { User } from '../schema/user.schema';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Current User Middleware');
    const { userId } = req?.session;
    if (userId) {
      const user = await this.userService.findUser(userId);
      Object.assign(req, { currentUser: user });
    }
    next();
  }
}
