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
import { User } from '../../users/entities/user.entity';

/**
 * Cart Entity
 * Shopping cart with items stored as JSON for flexibility
 */
@Entity('carts')
@Index(['userId'], { unique: true })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'simple-json', default: '[]' })
  items: CartItemData[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSavings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ default: 0 })
  itemCount: number;

  @Column({ type: 'varchar', nullable: true })
  couponCode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  couponDiscount: number;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: {
    lastUpdated?: Date;
    ipAddress?: string;
    userAgent?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/**
 * Cart Item Data Interface
 */
export interface CartItemData {
  productId: string;
  asin: string;
  title: string;
  brand: string;
  variantId?: string;
  variantSku?: string;
  variantOptions?: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  compareAtPrice?: number;
  image: string;
  isGift: boolean;
  giftMessage?: string;
  isPrimeEligible: boolean;
  sellerId: string;
  sellerName: string;
  addedAt: Date;
  inStock: boolean;
  maxQuantity: number;
}
