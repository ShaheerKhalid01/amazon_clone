import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, TreeChildren, TreeParent, Index } from 'typeorm';

@Entity('categories')
@Index(['slug'], { unique: true })  // ← Class level UNIQUE index
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 200 })
  // @Index()  ← COMMENT YA HATAO - class level already hai!
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  icon?: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @Column({ nullable: true })
  parentId?: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'simple-json', nullable: true })
  metaData?: any;

  @Column({ type: 'simple-json', nullable: true })
  filters?: any;

  @Column({ default: 0 })
  productCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}