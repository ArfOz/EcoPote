import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  backendURL: process.env['BACKEND_URL'],
  codeValidationTime: process.env['CODE_VALIDATION_TIME'],
  emailConfirmURL: process.env['EMAIL_CONFIRMATION_URL'],
  forgotPasswordURL: process.env['FORGOT_PASSWORD_URL'],
  jwt_secret: process.env['JWT_SECRET'] as string,
  jwt_secret_refresh: process.env['JWT_SECRET_REFRESH'] as string,
  jwt_expired: process.env['JWT_EXPIRED_TIME'] as string,
  jwt_refresh_expired: process.env['JWT_REFRESH_EXPIRED_TIME'] as string,
  differentIpTemplateName: process.env['DIFFERENT_IP_TEMPLATE_NAME'] as string,
  baseTemplateUrl: process.env['BASE_TEMPLATE_URL'] as string,
}));
