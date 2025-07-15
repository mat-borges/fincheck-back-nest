import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import { User } from './user.entity';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest<Request>();
  return req.user as User;
});
