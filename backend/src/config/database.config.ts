import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'sqlite',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10) || 0,
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  // Use in‑memory DB for any non‑production environment
  database:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_DATABASE || 'db.sqlite'
      : ':memory:',
  // Disable automatic schema sync in dev to avoid index recreation issues
  synchronize: false,
  dropSchema: false,
  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
}));
