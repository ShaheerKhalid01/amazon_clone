import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductAvailability } from '@shared/enums';

/**
 * Product Variant Entity
 * Stores different variations of a product (size, color, etc.)
 */
@Entity('product_variants')
@Index(['productId'])
@Index(['sku'], { unique: true })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ unique: true, length: 50 })
  sku: string;

  @Column({ type: 'simple-json' })
  optionValues: Record<string, string>; // e.g., { "Color": "Red", "Size": "Large" }

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice?: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({
    type: 'simple-enum',
    enum: ProductAvailability,
    default: ProductAvailability.IN_STOCK,
  })
  availability: ProductAvailability;

  @Column({ type: 'simple-json', nullable: true })
  images?: {
    id: string;
    url: string;
    thumbnailUrl: string;
    altText: string;
  }[];

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
