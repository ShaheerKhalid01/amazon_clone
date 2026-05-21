import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

/**
 * PaymentMethod Entity
 * Stores user's payment methods (cards, PayPal, etc.)
 */
@Entity('payment_methods')
@Index(['userId', 'isDefault'])
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.paymentMethods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'simple-enum', enum: ['CARD', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY'], default: 'CARD' })
  type: string;

  // Sensitive card details - stored encrypted in production; plain here for demo
  @Column({ nullable: true })
  cardNumber?: string;

  @Column({ nullable: true })
  expiryMonth?: string;

  @Column({ nullable: true })
  expiryYear?: string;

  @Column({ nullable: true })
  cvv?: string;

  @Column({ nullable: true })
  providerId?: string; // e.g., PayPal ID

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
