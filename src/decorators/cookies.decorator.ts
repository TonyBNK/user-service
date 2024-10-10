import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return key ? request.cookies?.[key] : request.cookies;
  },
);
