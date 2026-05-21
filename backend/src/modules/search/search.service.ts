import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

/**
 * Search Service
 * Advanced product search with filters, sorting, and suggestions
 */
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Search products with filters
   */
  async search(query: any) {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      rating,
      condition,
      brand,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('product.isDeleted = :isDeleted', { isDeleted: false });

    // Full-text search
    if (keyword) {
      queryBuilder.andWhere(
        `(
          product.title ILIKE :keyword OR 
          product.description ILIKE :keyword OR 
          product.brand ILIKE :keyword OR 
          product.bulletPoints::text ILIKE :keyword
        )`,
        { keyword: `%${keyword}%` },
      );
    }

    // Category filter
    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      queryBuilder.andWhere(
        'product.basePrice BETWEEN :minPrice AND :maxPrice',
        {
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 999999,
        },
      );
    }

    // Rating filter
    if (rating) {
      queryBuilder.andWhere('product.averageRating >= :rating', { rating });
    }

    // Condition filter
    if (condition) {
      queryBuilder.andWhere('product.condition = :condition', { condition });
    }

    // Brand filter
    if (brand) {
      queryBuilder.andWhere('product.brand ILIKE :brand', {
        brand: `%${brand}%`,
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        queryBuilder.orderBy('product.basePrice', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('product.basePrice', 'DESC');
        break;
      case 'rating':
        queryBuilder.orderBy('product.averageRating', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
      case 'bestseller':
        queryBuilder.orderBy('product.isBestSeller', 'DESC');
        break;
      default:
        // Relevance sorting (by keyword match)
        if (keyword) {
          queryBuilder.orderBy(
            `CASE 
              WHEN product.title ILIKE '${keyword}%' THEN 1
              WHEN product.title ILIKE '%${keyword}%' THEN 2
              ELSE 3
            END`,
            'ASC',
          );
        }
        queryBuilder.addOrderBy('product.createdAt', 'DESC');
    }

    // Pagination
    const skip = (page - 1) * limit;
    const [products, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(keyword: string, limit = 10): Promise<any[]> {
    if (!keyword || keyword.length < 2) return [];

    const suggestions = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.title', 'text')
      .where('product.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .limit(limit)
      .getRawMany();

    return suggestions;
  }

  /**
   * Get trending searches
   */
  async getTrendingSearches(): Promise<string[]> {
    // In production, this would come from analytics
    return [
      'wireless earbuds',
      'gaming laptop',
      'yoga mat',
      'coffee maker',
      'kindle books',
      'running shoes',
      'phone cases',
      'led lights',
    ];
  }

  /**
   * Get related searches
   */
  async getRelatedSearches(keyword: string): Promise<string[]> {
    // Generate related searches based on keyword
    const related: Record<string, string[]> = {
      laptop: ['gaming laptop', 'laptop stand', 'laptop bag', 'macbook'],
      phone: [
        'phone case',
        'phone charger',
        'wireless charger',
        'screen protector',
      ],
      shoes: ['running shoes', 'nike shoes', 'sneakers', 'sports shoes'],
    };

    return related[keyword.toLowerCase()] || [];
  }

  /**
   * Get search filters based on results
   */
  async getSearchFilters(keyword: string, category?: string) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true });

    if (keyword) {
      queryBuilder.andWhere('product.title ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    // Get filter aggregations
    const brands = await queryBuilder
      .clone()
      .select('product.brand', 'brand')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.brand')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const priceRanges = await queryBuilder
      .clone()
      .select('MIN(product.basePrice)', 'minPrice')
      .addSelect('MAX(product.basePrice)', 'maxPrice')
      .addSelect('AVG(product.basePrice)', 'avgPrice')
      .getRawOne();

    const ratingDistribution = await queryBuilder
      .clone()
      .select('FLOOR(product.averageRating)', 'rating')
      .addSelect('COUNT(*)', 'count')
      .groupBy('FLOOR(product.averageRating)')
      .getRawMany();

    return {
      brands: brands.map((b) => ({ name: b.brand, count: parseInt(b.count) })),
      priceRange: {
        min: Math.floor(priceRanges.minPrice || 0),
        max: Math.ceil(priceRanges.maxPrice || 1000),
        avg: Math.round(priceRanges.avgPrice || 0),
      },
      ratings: ratingDistribution.map((r) => ({
        stars: parseInt(r.rating),
        count: parseInt(r.count),
      })),
    };
  }
}
