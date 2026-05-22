import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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

  @Column({ default: 'CUSTOMER' })
  role: string;

  @Column({ default: 'FREE' })
  membershipTier: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLogin?: Date;

  // ✅ ADD THESE RELATIONS:
  @OneToMany('Address', 'user')
  addresses: any[];

  @OneToMany('PaymentMethod', 'user')
  paymentMethods: any[];

  @OneToMany('Review', 'user')
  reviews: any[];
}