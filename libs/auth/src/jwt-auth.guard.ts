// jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AUTH_MODE_KEY, AuthMode } from './auth-mode.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly staticToken: string | undefined;

  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector,
    private readonly configService: ConfigService
  ) {
    super();
    this.staticToken = this.configService.get<string>('STATIC_AUTH_TOKEN');
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    const authMode =
      this.reflector.get(AUTH_MODE_KEY, context.getHandler()) || 'jwt';

    if (!token) {
      throw new UnauthorizedException('Authorization token not found');
    }

    if (authMode === 'static') {
      if (this.staticToken && token === this.staticToken) {
        return true;
      } else {
        throw new UnauthorizedException('Static token not valid');
      }
    }

    if (authMode === 'jwt') {
      const isTokenValid = await this.authService.isTokenStored(token);
      if (!isTokenValid) {
        throw new UnauthorizedException('JWT token not stored in DB');
      }

      const result = super.canActivate(context);
      if (result instanceof Promise) {
        return result;
      } else if (result instanceof Observable) {
        return result ? (await result.toPromise()) ?? false : false;
      } else {
        return result;
      }
    }

    return false;
  }

  private extractTokenFromRequest(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [bearer, token] = authHeader.split(' ');
    return bearer === 'Bearer' ? token : null;
  }
}
