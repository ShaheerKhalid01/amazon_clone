import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';   // 👈 CHANGE 1: naya import
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminGateway } from './admin.gateway';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, Order]),
    JwtModule.registerAsync({                                   // 👈 CHANGE 2: registerAsync use karein
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'my-secret-key'),       // 👈 SAME secret jo AuthModule mein hai
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGateway],
  exports: [AdminService],
})
export class AdminModule {}