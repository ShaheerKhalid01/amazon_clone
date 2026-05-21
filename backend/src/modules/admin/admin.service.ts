import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { UserRole, OrderStatus, MembershipTier } from '@shared/enums';

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

  async getDashboardOverview() {
    const [totalUsers, activeUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.productRepository.count({ where: { isDeleted: false } }),
      this.orderRepository.count(),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'total')
        .where('order.status != :status', { status: 'CANCELLED' })
        .getRawOne(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await this.userRepository.count({
      where: { createdAt: Between(today, new Date()) } as any,
    });

    return {
      totalUsers,
      activeUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue?.total || 0,
      newUsersToday,
      pendingOrders: await this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
    };
  }

  async getAllUsers(page = 1, limit = 20, search?: string, role?: UserRole) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    const [users, total] = await queryBuilder
      .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.role',
        'user.membershipTier',
        'user.isActive',
        'user.createdAt',
      ])
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async toggleUserStatus(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return { message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive };
  }

  async updateUserRole(id: string, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.userRepository.save(user);
    return { message: 'Role updated', role: user.role };
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = false;
    await this.userRepository.save(user);
    return { message: 'User deleted (soft delete)' };
  }

  async getAllProducts(page = 1, limit = 20, search?: string, status?: string) {
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .where('product.isDeleted = :isDeleted', { isDeleted: false });

    if (search) queryBuilder.andWhere('product.title ILIKE :search', { search: `%${search}%` });
    if (status === 'active') queryBuilder.andWhere('product.isActive = true');
    if (status === 'inactive') queryBuilder.andWhere('product.isActive = false');

    const [products, total] = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit).take(limit).getManyAndCount();

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.isDeleted = true;
    product.isActive = false;
    await this.productRepository.save(product);
    return { message: 'Product deleted' };
  }

  async toggleFeatured(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.isBestSeller = !product.isBestSeller;
    await this.productRepository.save(product);
    return { message: `Product ${product.isBestSeller ? 'featured' : 'unfeatured'}` };
  }

  async getAllOrders(page = 1, limit = 20, status?: string) {
    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status as any;
    order.updatedAt = new Date();
    await this.orderRepository.save(order);
    return { message: 'Order status updated', status: order.status };
  }

  async getRevenueAnalytics(period: string) {
    return {
      period,
      data: [
        { month: 'Jan', revenue: 12500, orders: 150 },
        { month: 'Feb', revenue: 18200, orders: 210 },
        { month: 'Mar', revenue: 15800, orders: 185 },
        { month: 'Apr', revenue: 22100, orders: 260 },
        { month: 'May', revenue: 19500, orders: 230 },
        { month: 'Jun', revenue: 24800, orders: 290 },
      ],
    };
  }

  async getTopProducts(limit = 10) {
    return this.productRepository.find({
      where: { isActive: true, isDeleted: false },
      order: { totalReviews: 'DESC', averageRating: 'DESC' },
      take: limit,
      select: ['id', 'title', 'brand', 'basePrice', 'averageRating', 'totalReviews', 'totalQuantity'],
    });
  }

  async getUserStats() {
    const totalUsers = await this.userRepository.count();
    const primeUsers = await this.userRepository.count({ where: { membershipTier: MembershipTier.PRIME } });
    const sellers = await this.userRepository.count({ where: { role: UserRole.SELLER } });
    
    return {
      totalUsers,
      primeUsers,
      sellers,
      customers: totalUsers - sellers,
      primePercentage: totalUsers > 0 ? Math.round((primeUsers / totalUsers) * 100) : 0,
    };
  }
}
