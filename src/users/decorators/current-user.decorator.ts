import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    console.log('--- CurrentUser', data);
    const request = context.switchToHttp().getRequest();
    console.log('decorator context', request.session);
    return request.currentUser;
  },
);
