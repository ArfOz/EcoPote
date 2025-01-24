import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service'; // Import your AuthService
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const isTokenValid = await this.authService.isTokenStored(token);
    if (!isTokenValid) {
      throw new UnauthorizedException('Token is not stored in the database');
    }

    const canActivateResult = super.canActivate(context);
    if (canActivateResult instanceof Promise) {
      return canActivateResult;
    } else if (canActivateResult instanceof Observable) {
      return canActivateResult
        ? (await canActivateResult.toPromise()) ?? false
        : false;
    } else {
      return canActivateResult;
    }
  }

  private extractTokenFromRequest(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }
    const [bearer, token] = authHeader.split(' ');
    return bearer === 'Bearer' ? token : null;
  }
}
