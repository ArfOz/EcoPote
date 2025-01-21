import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminDatabaseService } from '@database';

@Injectable()
export class AuthService {
  constructor(
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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const options = { expiresIn: '1h' };

    return this.jwtService.sign(payload, options);
  }
}
