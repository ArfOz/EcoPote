import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    // ...existing imports...
  ],
  providers: [
    // ...existing providers...
    AuthService,
    JwtAuthGuard, // ensure guard is a provider
  ],
  exports: [
    // ...existing exports...
    AuthService,
    JwtAuthGuard, // export if you want to use it elsewhere
  ],
})
export class AuthModule {}
