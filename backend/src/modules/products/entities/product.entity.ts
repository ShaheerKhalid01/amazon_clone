import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { ProductReview } from './product-review.entity';
import {
  ProductCategory,
  ProductCondition,
  ProductAvailability,
} from '@shared/enums';

/**
 * Product Entity
 * Core product data model for the e-commerce platform
 */
@Entity('products')
@Index(['asin'], { unique: true })
@Index(['category'])
@Index(['brand'])
@Index(['isActive', 'createdAt'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 10 })
  asin: string; // Amazon Standard Identification Number

  @Column({ length: 500 })
  @Index({ fulltext: true })
  title: string;

  @Column({ nullable: true, length: 200 })
  subtitle?: string;

  @Column({ length: 100 })
  @Index()
  brand: string;

  @Column({ length: 100 })
  manufacturer: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-json' })
  bulletPoints: string[];

  @Column({ type: 'text', nullable: true })
  longDescription?: string;

  @Column({ type: 'text', nullable: true })
  technicalDetails?: string;

  // Categorization
  @Column({
    type: 'simple-enum',
    enum: ProductCategory,
  })
  @Index()
  category: ProductCategory;

  @Column({ length: 100 })
  subCategory: string;

  @Column({ type: 'simple-json', default: '[]' })
  tags: string[];

  // Pricing (denormalized for quick access)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice?: number;

  @Column({ default: false })
  isOnSale: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  savingsPercentage?: number;

  @Column({ default: 'USD', length: 3 })
  currency: string;

  // Inventory
  @Column({ default: 0 })
  totalQuantity: number;

  @Column({ default: 0 })
  reservedQuantity: number;

  @Column({
    type: 'simple-enum',
    enum: ProductCondition,
    default: ProductCondition.NEW,
  })
  condition: ProductCondition;

  @Column({
    type: 'simple-enum',
    enum: ProductAvailability,
    default: ProductAvailability.IN_STOCK,
  })
  availability: ProductAvailability;

  // Media
  @Column({ type: 'simple-json', default: '[]' })
  images: {
    id: string;
    url: string;
    thumbnailUrl: string;
    altText: string;
    isPrimary: boolean;
    order: number;
  }[];

  @Column({ type: 'simple-json', nullable: true })
  videos?: {
    id: string;
    url: string;
    thumbnailUrl: string;
    title: string;
    duration: number;
    type: string;
  }[];

  // Dimensions
  @Column({ type: 'simple-json' })
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: string;
    weightUnit: string;
  };

  // Shipping
  @Column({ type: 'simple-json' })
  shipping: {
    freeShipping: boolean;
    freeShippingThreshold?: number;
    shippingCost?: number;
    estimatedDelivery: {
      minDays: number;
      maxDays: number;
    };
    shipsFrom: string;
    internationalShipping: boolean;
  };

  // Reviews Summary (denormalized)
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ type: 'simple-json', default: '{}' })
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  // Amazon Features
  @Column({ default: false })
  isPrimeEligible: boolean;

  @Column({ default: false })
  isAmazonChoice: boolean;

  @Column({ default: false })
  isBestSeller: boolean;

  @Column({ default: false })
  isAmazonBrand: boolean;

  @Column({ default: false })
  hasCoupon: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  couponValue?: number;

  @Column({ nullable: true, length: 10 })
  couponType?: 'percentage' | 'fixed';

  @Column({ default: false })
  isSubscribeAndSave: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  subscribeAndSaveDiscount?: number;

  @Column({ default: false })
  isClimatePledgeFriendly: boolean;

  @Column({ default: false })
  isAlexaEnabled: boolean;

  @Column({ default: false })
  tradeInEligible: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tradeInValue?: number;

  // SEO
  @Column({ type: 'simple-json', nullable: true })
  seo?: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    ogImage?: string;
  };

  // Seller Info
  @Column()
  sellerId: string;

  @Column({ length: 200 })
  sellerName: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  sellerRating?: number;

  // Status
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  // Timestamps
  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  launchDate?: Date;

  @Column({ nullable: true })
  discontinuedDate?: Date;

  // Relationships
  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    eager: false,
  })
  variants: ProductVariant[];

  @OneToMany(() => ProductReview, (review) => review.product)
  reviews: ProductReview[];

  /**
   * Get available quantity
   */
  get availableQuantity(): number {
    return this.totalQuantity - this.reservedQuantity;
  }

  /**
   * Check if product is in stock
   */
  get inStock(): boolean {
    return (
      this.availableQuantity > 0 &&
      this.availability === ProductAvailability.IN_STOCK
    );
  }

  /**
   * Get current price (sale or regular)
   */
  get currentPrice(): number {
    return this.isOnSale && this.salePrice ? this.salePrice : this.basePrice;
  }

  @BeforeInsert()
  generateAsin() {
    if (!this.asin) {
      this.asin = 'B' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  }
}
