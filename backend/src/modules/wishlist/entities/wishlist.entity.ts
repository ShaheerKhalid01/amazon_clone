import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('wishlists')
@Index(['userId'], { unique: true })
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column({ type: 'simple-json', default: '[]' })
  items: {
    productId: string;
    variantId?: string;
    addedAt: Date;
    priority: string;
    quantity: number;
    isPublic: boolean;
  }[];

  @Column({ default: 0 })
  itemCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
