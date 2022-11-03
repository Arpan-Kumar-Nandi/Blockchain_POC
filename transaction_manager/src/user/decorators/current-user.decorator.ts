import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext) => {
    console.log('current user decorator');
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
