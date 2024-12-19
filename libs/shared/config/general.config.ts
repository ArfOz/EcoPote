import { registerAs } from '@nestjs/config';

export default registerAs('general', () => ({
  database_host: process.env.DATABASE_HOST,
  database_port: process.env.DATABASE_PORT,
  database_username: process.env.DATABASE_USERNAME,
  database_password: process.env.DATABASE_PASSWORD,
  database_name: process.env.DATABASE_NAME,
  database_url: process.env.DATABASE_URL,
}));
