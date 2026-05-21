import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

/**
 * Category Entity
 * Hierarchical category tree structure for product organization
 */
@Entity('categories')
@Tree('closure-table')
@Index(['slug'], { unique: true })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 200 })
  @Index()
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  icon?: string;

  @TreeChildren()
  children?: Category[];

  @TreeParent()
  parent?: Category | null;

  @Column({ nullable: true })
  parentId?: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'simple-json', nullable: true })
  metaData?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  @Column({ type: 'simple-json', nullable: true })
  filters?: {
    specifications?: string[];
    priceRange?: { min: number; max: number }[];
    brands?: string[];
  };

  @Column({ default: 0 })
  productCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
