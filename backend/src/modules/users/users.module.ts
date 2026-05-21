import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { PaymentMethod } from './entities/payment-method.entity';

/**
 * Users Module
 * Handles user profiles, addresses, and account management
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Address, PaymentMethod])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
