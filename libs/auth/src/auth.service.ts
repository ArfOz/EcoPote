import authConfig from 'libs/auth/src/config/auth.config';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminDatabaseService } from '@database';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authCfg: ConfigType<typeof authConfig>,
    private readonly userDatabaseService: AdminDatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const admin = await this.userDatabaseService.findOne({ email });
    if (admin && admin.password === pass) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(email: string, id: number) {
    const payload = { email: email, sub: id };
    const options = { secret: this.authCfg.jwt_secret, expiresIn: '1h' };

    return this.jwtService.sign(payload, options);
  }
  async decodeToken(
    token: string
  ): Promise<{ email: string; sub: number } | false> {
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.authCfg.jwt_secret,
      });
      console.log('decodeddd', decoded);
      return decoded;
    } catch {
      return false;
    }
  }
}
