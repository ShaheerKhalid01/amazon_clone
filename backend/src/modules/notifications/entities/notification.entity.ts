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

export type NotificationType =
  | 'ORDER_UPDATE'
  | 'PRICE_DROP'
  | 'BACK_IN_STOCK'
  | 'DEAL_ALERT'
  | 'SHIPPING_UPDATE'
  | 'REVIEW_REQUEST'
  | 'PROMOTIONAL'
  | 'SYSTEM'
  | 'WISHLIST_REMINDER'
  | 'COUPON_AVAILABLE';

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: [
      'ORDER_UPDATE',
      'PRICE_DROP',
      'BACK_IN_STOCK',
      'DEAL_ALERT',
      'SHIPPING_UPDATE',
      'REVIEW_REQUEST',
      'PROMOTIONAL',
      'SYSTEM',
      'WISHLIST_REMINDER',
      'COUPON_AVAILABLE',
    ],
  })
  type: NotificationType;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true, length: 500 })
  link?: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt?: Date;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>;

  @Column({ default: false })
  isEmailSent: boolean;

  @Column({ default: false })
  isPushSent: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
