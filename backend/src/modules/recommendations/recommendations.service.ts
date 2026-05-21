import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductReview } from '../products/entities/product-review.entity';
import { CacheService } from '../../cache/redis-cache.service';

/**
 * Recommendations Service
 * Provides personalized product recommendations
 */
@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Get personalized recommendations for user
   */
  async getPersonalizedRecommendations(userId: string, limit = 10) {
    const cacheKey = `recommendations:personalized:${userId}`;

    // Try cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    // Get user's purchase history and reviews
    const userReviews = await this.reviewRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
      take: 20,
    });

    // Extract preferred categories and brands
    const preferredCategories = new Map<string, number>();
    const preferredBrands = new Map<string, number>();

    userReviews.forEach((review) => {
      if (review.product) {
        const catWeight = review.rating >= 4 ? 3 : review.rating >= 3 ? 1 : 0;
        preferredCategories.set(
          review.product.category,
          (preferredCategories.get(review.product.category) || 0) + catWeight,
        );
        preferredBrands.set(
          review.product.brand,
          (preferredBrands.get(review.product.brand) || 0) + catWeight,
        );
      }
    });

    // Sort by preference weight
    const sortedCategories = [...preferredCategories.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);

    const sortedBrands = [...preferredBrands.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([brand]) => brand);

    // Get recommended products
    let recommendations: Product[] = [];

    if (sortedCategories.length > 0) {
      recommendations = await this.productRepository
        .createQueryBuilder('product')
        .where('product.category IN (:...categories)', {
          categories: sortedCategories,
        })
        .andWhere('product.isActive = true')
        .andWhere('product.isDeleted = false')
        .orderBy('product.averageRating', 'DESC')
        .addOrderBy('product.totalReviews', 'DESC')
        .take(limit)
        .getMany();
    }

    // If not enough, add popular products
    if (recommendations.length < limit) {
      const popularProducts = await this.getPopularProducts(
        limit - recommendations.length,
        sortedCategories,
      );
      const existingIds = new Set(recommendations.map((p) => p.id));
      recommendations = [
        ...recommendations,
        ...popularProducts.filter((p) => !existingIds.has(p.id)),
      ];
    }

    // Cache for 1 hour
    await this.cacheService.set(cacheKey, recommendations, 3600);

    return recommendations.slice(0, limit);
  }

  /**
   * Get frequently bought together products
   */
  async getFrequentlyBoughtTogether(productId: string, limit = 5) {
    const cacheKey = `recommendations:fbt:${productId}`;

    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) return [];

    // Get products in same category with high ratings
    const relatedProducts = await this.productRepository
      .createQueryBuilder('product')
      .where('product.category = :category', { category: product.category })
      .andWhere('product.id != :productId', { productId })
      .andWhere('product.isActive = true')
      .orderBy('product.averageRating', 'DESC')
      .addOrderBy('product.totalReviews', 'DESC')
      .take(limit)
      .getMany();

    await this.cacheService.set(cacheKey, relatedProducts, 7200);

    return relatedProducts;
  }

  /**
   * Get popular products
   */
  async getPopularProducts(limit = 10, excludeCategories: string[] = []) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = true')
      .andWhere('product.isDeleted = false');

    if (excludeCategories.length > 0) {
      queryBuilder.andWhere('product.category NOT IN (:...categories)', {
        categories: excludeCategories,
      });
    }

    return queryBuilder
      .orderBy('product.totalReviews', 'DESC')
      .addOrderBy('product.averageRating', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Get trending products
   */
  async getTrendingProducts(limit = 10) {
    const cacheKey = 'recommendations:trending';

    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trending = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.reviews', 'review')
      .where('review.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
      .andWhere('product.isActive = true')
      .groupBy('product.id')
      .orderBy('COUNT(review.id)', 'DESC')
      .addOrderBy('product.averageRating', 'DESC')
      .take(limit)
      .getMany();

    await this.cacheService.set(cacheKey, trending, 1800);

    return trending;
  }

  /**
   * Get category-based recommendations
   */
  async getCategoryRecommendations(category: string, limit = 10) {
    return this.productRepository.find({
      where: {
        category: category as any,
        isActive: true,
        isDeleted: false,
      },
      order: {
        isBestSeller: 'DESC',
        averageRating: 'DESC',
        totalReviews: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get similar products based on tags and features
   */
  async getSimilarProducts(productId: string, limit = 8) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) return [];

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.id != :productId', { productId })
      .andWhere('product.isActive = true');

    // Match by category
    queryBuilder.andWhere(
      '(product.category = :category OR product.subCategory = :subCategory)',
      {
        category: product.category,
        subCategory: product.subCategory,
      },
    );

    // Match by brand
    if (product.brand) {
      queryBuilder.orWhere('product.brand = :brand', { brand: product.brand });
    }

    // Match by price range (±30%)
    const priceRange = 0.3;
    queryBuilder.orWhere('product.basePrice BETWEEN :minPrice AND :maxPrice', {
      minPrice: product.basePrice * (1 - priceRange),
      maxPrice: product.basePrice * (1 + priceRange),
    });

    return queryBuilder
      .orderBy('product.averageRating', 'DESC')
      .take(limit)
      .getMany();
  }
}
