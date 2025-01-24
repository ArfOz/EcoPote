import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    console.log('LocalAuthGuard: canActivate called');
    if (this.isTokenExpired(token)) {
      throw new UnauthorizedException('Token is expired');
    }

    const result = (await super.canActivate(context)) as boolean;
    await super.logIn(request);
    return result;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [, token] = authHeader.split(' ');
    return token;
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
    );
    return payload.exp * 1000 < Date.now();
  }
}
