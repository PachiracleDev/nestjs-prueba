import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  db: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  tokens_secret: {
    access: process.env.JWT_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
  },
}));
