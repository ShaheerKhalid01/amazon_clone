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
import { User } from './user.entity';

/**
 * Address Entity
 * Stores user shipping and billing addresses
 */
@Entity('addresses')
@Index(['userId', 'isDefault'])
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 100 })
  fullName: string;

  @Column({ length: 20 })
  phoneNumber: string;

  @Column({ length: 255 })
  streetAddress: string;

  @Column({ nullable: true, length: 100 })
  apartment?: string;

  @Column({ nullable: true, length: 100 })
  landmark?: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 20 })
  zipCode: string;

  @Column({ length: 100 })
  country: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ nullable: true })
  addressType?: 'HOME' | 'WORK' | 'OTHER';

  @Column({ nullable: true, length: 500 })
  deliveryInstructions?: string;

  @Column({ type: 'simple-json', nullable: true })
  coordinates?: {
    latitude: number;
    longitude: number;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullAddress(): string {
    const parts = [
      this.streetAddress,
      this.apartment,
      this.city,
      this.state,
      this.zipCode,
      this.country,
    ];
    return parts.filter(Boolean).join(', ');
  }
}
