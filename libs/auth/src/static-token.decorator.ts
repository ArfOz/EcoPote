// static-token.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const STATIC_TOKEN_REQUIRED = 'static_token_required';

export const StaticTokenRequired = () =>
  SetMetadata(STATIC_TOKEN_REQUIRED, true);
