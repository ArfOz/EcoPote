import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class StaticTokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handlerRequired = this.reflector.get<boolean>(
      'staticTokenRequired',
      context.getHandler()
    );
    const classRequired = this.reflector.get<boolean>(
      'staticTokenRequired',
      context.getClass()
    );
    if (!handlerRequired && !classRequired) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const incoming =
      req.headers['x-static-token'] || req.headers['authorization'];
    const expected = process.env.STATIC_TOKEN;
    if (!incoming || incoming !== expected) {
      throw new UnauthorizedException('Invalid static token');
    }
    return true;
  }
}
