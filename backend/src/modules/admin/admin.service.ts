import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

/**
 * Admin Service
 * Handles admin dashboard and management
 */
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Get admin dashboard overview
   */
  async dashboardSummary() {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      totalOrders,
      totalRevenueResult,
      newUsersToday,
      newProductsToday,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.productRepository.count({ where: { isDeleted: false } }),
      this.orderRepository.count(),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'sum')
        .getRawOne(),
      this.userRepository.count({
        where: {
          createdAt: MoreThanOrEqual(new Date(new Date().setHours(0, 0, 0, 0))),
        } as any,
      }),
      this.productRepository.count({
        where: {
          createdAt: MoreThanOrEqual(new Date(new Date().setHours(0, 0, 0, 0))),
        } as any,
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalProducts,
      totalOrders,
      totalRevenue: parseFloat(totalRevenueResult?.sum || '0'),
      newUsersToday,
      newProductsToday,
    };
  }

  /**
   * Get all users (admin)
   */
  async getAllUsers(page = 1, limit = 20) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'createdAt',
      ],
    });

    return { users, total };
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.isActive = !user.isActive;
      await this.userRepository.save(user);
      this.logger.log(`User ${userId} status toggled to ${user.isActive}`);
    }
  }
}
