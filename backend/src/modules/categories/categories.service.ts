import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';

/**
 * Categories Service
 * Handles hierarchical category management
 */
@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  /**
   * Create a new category
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, ...categoryData } = createCategoryDto;

    // Check if slug already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { slug: categoryData.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = this.categoryRepository.create(categoryData);

    // Set parent if provided
    if (parentId) {
      const parent = await this.findById(parentId);
      category.parent = parent;
    }

    const savedCategory = await this.categoryRepository.save(category);
    this.logger.log(`Category created: ${savedCategory.name}`);

    return savedCategory;
  }

  /**
   * Get all categories as tree
   */
  async findAll(): Promise<Category[]> {
    const trees = await this.categoryRepository.findTrees({
      relations: ['children'],
    });
    return this.filterActive(trees);
  }

  /**
   * Get category tree with products count
   */
  async getCategoryTree(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    return this.buildTree(categories);
  }

  /**
   * Find category by ID
   */
  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Find category by slug
   */
  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug, isActive: true },
      relations: ['children', 'parent'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  /**
   * Update category
   */
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findById(id);
    const { parentId, ...updateData } = updateCategoryDto;

    // Check slug uniqueness if changed
    if (updateData.slug && updateData.slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: updateData.slug },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Update parent
    if (parentId) {
      if (parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }
      const parent = await this.findById(parentId);
      category.parent = parent;
    }

    Object.assign(category, updateData);
    const updatedCategory = await this.categoryRepository.save(category);
    this.logger.log(`Category updated: ${updatedCategory.name}`);

    return updatedCategory;
  }

  /**
   * Delete category (and reassign children)
   */
  async delete(id: string): Promise<void> {
    const category = await this.findById(id);

    // Reassign children to parent
    if (category.children && category.children.length > 0) {
      if (category.parent) {
        for (const child of category.children) {
          child.parent = category.parent;
          await this.categoryRepository.save(child);
        }
      } else {
        for (const child of category.children) {
          child.parent = null;
          await this.categoryRepository.save(child);
        }
      }
    }

    await this.categoryRepository.remove(category);
    this.logger.log(`Category deleted: ${category.name}`);
  }

  /**
   * Get subcategories
   */
  async getSubcategories(parentId: string): Promise<Category[]> {
    const parent = await this.categoryRepository.findOne({
      where: { id: parentId, isActive: true },
      relations: ['children'],
    });

    if (!parent) {
      throw new NotFoundException('Parent category not found');
    }

    return parent.children?.filter((child) => child.isActive) || [];
  }

  /**
   * Get breadcrumb path
   */
  async getBreadcrumbs(categoryId: string): Promise<Category[]> {
    const category = await this.findById(categoryId);
    const breadcrumbs: Category[] = [];
    let current = category;

    while (current.parent) {
      breadcrumbs.unshift(current.parent);
      current = current.parent;
    }

    breadcrumbs.push(category);
    return breadcrumbs;
  }

  /**
   * Get featured categories
   */
  async getFeatured(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true, isFeatured: true },
      order: { sortOrder: 'ASC' },
      take: 12,
    });
  }

  /**
   * Filter active categories from tree
   */
  private filterActive(categories: Category[]): Category[] {
    return categories
      .filter((cat) => cat.isActive)
      .map((cat) => ({
        ...cat,
        children: cat.children ? this.filterActive(cat.children) : [],
      }));
  }

  /**
   * Build tree structure from flat list
   */
  private buildTree(categories: Category[]): Category[] {
    const map = new Map<string, Category>();
    const roots: Category[] = [];

    // Create map
    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    // Build tree
    categories.forEach((cat) => {
      const node = map.get(cat.id);
      if (!node) return;

      if (cat.parentId && map.has(cat.parentId)) {
        const parent = map.get(cat.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}
