import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole, MembershipTier } from '@shared/enums';
import { Review } from '../../reviews/review.entity';

/**
 * User Entity
 * Core user data model with all relationships
 */
@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  @Index()
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ nullable: true, length: 20 })
  phoneNumber?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({
    type: 'simple-enum',
    enum: MembershipTier,
    default: MembershipTier.FREE,
  })
  membershipTier: MembershipTier;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ nullable: true })
  verificationToken?: string;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ nullable: true })
  passwordResetExpires?: Date;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true })
  lastLoginIp?: string;

  @Column({ nullable: true })
  refreshTokenHash?: string;

  @Column({ type: 'simple-json', nullable: true })
  preferences?: {
    language?: string;
    currency?: string;
    theme?: 'light' | 'dark';
    notifications?: {
      email?: boolean;
      push?: boolean;
      promotional?: boolean;
    };
  };

  @Column({ type: 'simple-json', nullable: true })
  primeSubscription?: {
    startDate?: Date;
    endDate?: Date;
    autoRenew?: boolean;
    planType?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany('Address', 'user')
  addresses: any[];

  @OneToMany('PaymentMethod', 'user')
  paymentMethods: any[];

  @OneToMany('Order', 'user')
  orders: any[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  /**
   * Get full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Check if user is Prime member
   */
  get isPrime(): boolean {
    return (
      this.membershipTier === MembershipTier.PRIME ||
      this.membershipTier === MembershipTier.PRIME_STUDENT ||
      this.membershipTier === MembershipTier.PRIME_BUSINESS
    );
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateEmail() {
    this.email = this.email.toLowerCase().trim();
  }
}
