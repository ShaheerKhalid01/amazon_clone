import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  // ✅ FIXED: Remove relation or fix it
  // @ManyToOne(() => User, (user) => user.reviews)
  // user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number;
}