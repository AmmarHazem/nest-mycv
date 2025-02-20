import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<object> | Promise<Observable<any>> {
    // run code before a request is handled by request handler
    // console.log('=== running before handler');
    return next.handle().pipe(
      map((data: any) => {
        // run something before response is sent out
        // console.log('running before response is sent out', data);
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
