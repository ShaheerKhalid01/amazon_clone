import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SearchModule } from './modules/search/search.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { PaymentsModule } from './modules/payments/payments.module';

// Middleware
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    // ===== CONFIGURATION =====
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig],
      envFilePath: ['.env', '.env.development', '.env.production'],
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    // ===== DATABASE =====
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Explicitly type the return value of get to match TypeORM's expected types
        const dbType = configService.get<'postgres' | 'mysql' | 'mssql' | 'sqlite' | 'oracle' | 'cockroachdb'>('database.type', 'postgres');
        
        return {
          type: dbType, // No longer needs 'as any'
          host: configService.get<string>('database.host', 'localhost'),
          port: configService.get<number>('database.port', 5432),
          username: configService.get<string>('database.username', 'user'),
          password: configService.get<string>('database.password', 'password'),
          database: configService.get<string>('database.database', 'test'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>('database.synchronize', false),
          logging: configService.get<boolean>('database.logging', false),
          autoLoadEntities: true,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        } as TypeOrmModuleOptions;
      },
    }),

    // ===== RATE LIMITING =====
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // ===== CACHING =====
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000, // 1 minute default
      max: 100, // maximum items in cache
    }),

    // ===== EVENT EMITTER =====
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: process.env.NODE_ENV === 'development',
    }),

    // ===== SCHEDULING =====
    ScheduleModule.forRoot(),

    // ===== FEATURE MODULES =====
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    SearchModule,
    ReviewsModule,
    WishlistModule,
    PaymentsModule,
  ],
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}