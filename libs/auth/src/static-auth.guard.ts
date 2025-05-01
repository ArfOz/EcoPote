import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const STATIC_TOKEN_KEY = 'a';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class StaticTokenAuthGuard
  extends AuthGuard('static-token')
  implements CanActivate
{
  constructor(private reflector: Reflector) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isStaticRequired = this.reflector.get<boolean>(
      STATIC_TOKEN_KEY,
      context.getHandler()
    );

    if (!isStaticRequired) {
      // If decorator is not present, skip static token auth
      return true;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
