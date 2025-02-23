import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    console.log('--- CurrentUser', data);
    return 'hi there';
  },
);
