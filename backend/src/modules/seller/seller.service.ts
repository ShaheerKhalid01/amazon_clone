import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

/**
 * Seller Service
 * Handles seller-specific business logic
 */
@Injectable()
export class SellerService {
  private readonly logger = new Logger(SellerService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Get seller dashboard stats
   */
  async getDashboardStats(sellerId: string) {
    const products = await this.productRepository.find({
      where: { sellerId },
    });

    const activeProducts = products.filter((p) => p.isActive && !p.isDeleted);
    const totalRevenue = products.reduce(
      (sum, p) => sum + p.basePrice * p.totalQuantity,
      0,
    );

    return {
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      totalSales: 0, // From orders
      totalRevenue,
      averageRating:
        products.reduce((sum, p) => sum + p.averageRating, 0) /
          products.length || 0,
      totalReviews: products.reduce((sum, p) => sum + p.totalReviews, 0),
    };
  }

  /**
   * Get seller's products
   */
  async getProducts(sellerId: string, filters: any) {
    const { search, status, page = 1, limit = 20 } = filters;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.sellerId = :sellerId', { sellerId });

    if (search) {
      queryBuilder.andWhere('product.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (status === 'active') {
      queryBuilder.andWhere('product.isActive = :isActive', { isActive: true });
    } else if (status === 'out_of_stock') {
      queryBuilder.andWhere('product.totalQuantity = 0');
    }

    const [products, total] = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { products, total };
  }

  /**
   * Verify product ownership
   */
  async verifyOwnership(productId: string, sellerId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('You do not own this product');
    }

    return product;
  }
}
