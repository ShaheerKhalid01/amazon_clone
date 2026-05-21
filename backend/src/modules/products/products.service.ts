import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductReview } from './entities/product-review.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductAvailability } from '@shared/enums';

/**
 * Products Service
 * Handles all product-related business logic
 */
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
  ) {}

  /**
   * Create a new product
   */
  async create(
    createProductDto: CreateProductDto,
    sellerId: string,
    sellerName: string,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      sellerId,
      sellerName,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      shipping: {
        freeShipping: true,
        estimatedDelivery: { minDays: 5, maxDays: 7 },
        shipsFrom: 'US',
        internationalShipping: false,
      },
    });

    const savedProduct = await this.productRepository.save(product);
    this.logger.log(
      `Product created: ${savedProduct.title} (${savedProduct.id})`,
    );
    return savedProduct;
  }

  /**
   * Find all products with filtering, sorting, and pagination
   */
  async findAll(filters: ProductFilterDto) {
    const {
      keyword,
      category,
      subCategory,
      brands,
      minPrice,
      maxPrice,
      minRating,
      availability,
      condition,
      primeEligible,
      onSale,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    // Build where conditions
    const where: FindOptionsWhere<Product> = {
      isActive: true,
      isDeleted: false,
    };

    if (category) {
      where.category = category;
    }

    if (subCategory) {
      where.subCategory = subCategory;
    }

    if (brands && brands.length > 0) {
      where.brand = In(brands);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = Between(minPrice || 0, maxPrice || 999999);
    }

    if (minRating) {
      where.averageRating = MoreThanOrEqual(minRating);
    }

    if (availability) {
      where.availability = availability;
    }

    if (condition) {
      where.condition = condition;
    }

    if (primeEligible) {
      where.isPrimeEligible = true;
    }

    if (onSale) {
      where.isOnSale = true;
    }

    // Build query
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where(where)
      .leftJoinAndSelect(
        'product.variants',
        'variants',
        'variants.isActive = :isActive',
        { isActive: true },
      );

    // Keyword search
    if (keyword) {
      queryBuilder.andWhere(
        '(product.title ILIKE :keyword OR product.description ILIKE :keyword OR product.brand ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // Sorting
    const sortField = `product.${sortBy}`;
    queryBuilder.orderBy(sortField, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute
    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Find product by ID with all relations
   */
  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true, isDeleted: false },
      relations: ['variants', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Find product by ASIN
   */
  async findByAsin(asin: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { asin, isActive: true },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ASIN ${asin} not found`);
    }

    return product;
  }

  /**
   * Update product
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    sellerId: string,
  ): Promise<Product> {
    const product = await this.findById(id);

    // Verify ownership
    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('You can only update your own products');
    }

    // If sale price is set, automatically mark as on sale
    const dto = updateProductDto as any;
    if (dto.salePrice !== undefined) {
      dto.isOnSale = dto.salePrice < (dto.basePrice || product.basePrice);
      if (dto.isOnSale && dto.basePrice) {
        dto.savingsPercentage =
          ((dto.basePrice - dto.salePrice) / dto.basePrice) * 100;
      }
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    this.logger.log(`Product updated: ${updatedProduct.title}`);
    return updatedProduct;
  }

  /**
   * Delete product (soft delete)
   */
  async delete(id: string, sellerId: string): Promise<void> {
    const product = await this.findById(id);

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    product.isDeleted = true;
    product.isActive = false;
    await this.productRepository.save(product);
    this.logger.log(`Product deleted: ${product.title}`);
  }

  /**
   * Update product inventory
   */
  async updateInventory(
    id: string,
    quantity: number,
    variantId?: string,
  ): Promise<void> {
    if (variantId) {
      const variant = await this.variantRepository.findOne({
        where: { id: variantId, productId: id },
      });

      if (!variant) {
        throw new NotFoundException('Variant not found');
      }

      variant.quantity = quantity;
      variant.availability =
        quantity > 0
          ? ProductAvailability.IN_STOCK
          : ProductAvailability.OUT_OF_STOCK;

      await this.variantRepository.save(variant);
    } else {
      const product = await this.findById(id);
      product.totalQuantity = quantity;
      product.availability =
        quantity > 0
          ? ProductAvailability.IN_STOCK
          : ProductAvailability.OUT_OF_STOCK;

      await this.productRepository.save(product);
    }
  }

  /**
   * Get featured products
   */
  async getFeatured(limit = 10): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        isActive: true,
        isDeleted: false,
        isBestSeller: true,
      },
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get deals (products on sale)
   */
  async getDeals(limit = 20): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        isActive: true,
        isDeleted: false,
        isOnSale: true,
      },
      take: limit,
      order: { savingsPercentage: 'DESC' },
    });
  }

  /**
   * Get related products
   */
  async getRelated(productId: string, limit = 10): Promise<Product[]> {
    const product = await this.findById(productId);

    return this.productRepository.find({
      where: {
        isActive: true,
        isDeleted: false,
        category: product.category,
        id: Not(productId), // Exclude current product
      },
      take: limit,
      order: { averageRating: 'DESC' },
    });
  }

  /**
   * Get product variants
   */
  async getVariants(productId: string): Promise<ProductVariant[]> {
    return this.variantRepository.find({
      where: { productId, isActive: true },
      order: { isDefault: 'DESC', price: 'ASC' },
    });
  }

  /**
   * Add product review
   */
  async addReview(
    productId: string,
    userId: string,
    reviewData: any,
  ): Promise<ProductReview> {
    const product = await this.findById(productId);

    // Check if user already reviewed
    const existingReview = await this.reviewRepository.findOne({
      where: { productId, userId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const review = this.reviewRepository.create({
      productId,
      userId,
      ...reviewData,
    });

    const savedReview = (await this.reviewRepository.save(
      review,
    )) as unknown as ProductReview;

    // Update product rating
    await this.updateProductRating(productId);

    return savedReview;
  }

  /**
   * Update product average rating
   */
  private async updateProductRating(productId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { productId, isActive: true },
    });

    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Calculate distribution
    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });

    await this.productRepository.update(productId, {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    });
  }
}
