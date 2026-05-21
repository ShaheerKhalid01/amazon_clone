import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
  ttl: 60 * 60, // 1 hour default cache
  max: 100, // maximum number of items in cache
}));
