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
import { User } from '../../users/entities/user.entity';

/**
 * Product Review Entity
 * Stores user reviews and ratings for products
 */
@Entity('product_reviews')
@Index(['productId'])
@Index(['userId'])
@Index(['rating'])
export class ProductReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number; // 1.00 to 5.00

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-json', nullable: true })
  pros?: string[];

  @Column({ type: 'simple-json', nullable: true })
  cons?: string[];

  @Column({ type: 'simple-json', nullable: true })
  images?: string[];

  @Column({ type: 'simple-json', nullable: true })
  videos?: string[];

  @Column({ default: false })
  verifiedPurchase: boolean;

  @Column({ default: 0 })
  helpfulCount: number;

  @Column({ default: 0 })
  notHelpfulCount: number;

  @Column({ type: 'simple-json', nullable: true })
  variantInfo?: Record<string, string>; // Which variant was purchased

  @Column({ default: false })
  isAmazonVine: boolean;

  @Column({ default: false })
  isTopContributor: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFlagged: boolean;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
