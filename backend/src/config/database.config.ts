import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'sqlite',
  database: join(__dirname, '..', '..', process.env.DB_DATABASE || 'amazon_clone.sqlite'),
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: true,  // ✅ TABLES AUTO CREATE
  logging: false,
}));