import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../modules/categories/entities/category.entity';

/**
 * Categories Seed Data
 */
@Injectable()
export class CategoriesSeed {
  private readonly logger = new Logger(CategoriesSeed.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    this.logger.log('Seeding categories...');

    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        icon: '🖥️',
        description: 'Computers, tablets, phones, and accessories',
        isFeatured: true,
        children: [
          { name: 'Laptops', slug: 'laptops', icon: '💻' },
          { name: 'Smartphones', slug: 'smartphones', icon: '📱' },
          { name: 'Headphones', slug: 'headphones', icon: '🎧' },
          { name: 'Cameras', slug: 'cameras', icon: '📷' },
          { name: 'Gaming', slug: 'gaming', icon: '🎮' },
        ],
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        icon: '👗',
        description: 'Clothing, shoes, jewelry, and watches',
        isFeatured: true,
        children: [
          { name: 'Men', slug: 'men-fashion', icon: '👔' },
          { name: 'Women', slug: 'women-fashion', icon: '👗' },
          { name: 'Kids', slug: 'kids-fashion', icon: '👶' },
          { name: 'Shoes', slug: 'shoes', icon: '👟' },
          { name: 'Watches', slug: 'watches', icon: '⌚' },
        ],
      },
      {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        icon: '🏠',
        description: 'Furniture, appliances, and home decor',
        isFeatured: true,
        children: [
          { name: 'Furniture', slug: 'furniture', icon: '🛋️' },
          {
            name: 'Kitchen Appliances',
            slug: 'kitchen-appliances',
            icon: '🍳',
          },
          { name: 'Home Decor', slug: 'home-decor', icon: '🖼️' },
          { name: 'Bedding', slug: 'bedding', icon: '🛏️' },
        ],
      },
      {
        name: 'Books',
        slug: 'books',
        icon: '📚',
        description: 'Books, e-books, and audiobooks',
        isFeatured: true,
        children: [
          { name: 'Fiction', slug: 'fiction', icon: '📖' },
          { name: 'Non-Fiction', slug: 'non-fiction', icon: '📕' },
          { name: "Children's Books", slug: 'children-books', icon: '📗' },
          { name: 'Textbooks', slug: 'textbooks', icon: '📘' },
        ],
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        icon: '⚽',
        description: 'Sports equipment, outdoor gear, and fitness',
        isFeatured: true,
        children: [
          { name: 'Exercise & Fitness', slug: 'fitness', icon: '🏋️' },
          { name: 'Outdoor Recreation', slug: 'outdoor', icon: '🏕️' },
          { name: 'Sports Equipment', slug: 'sports-equipment', icon: '⚾' },
          { name: 'Yoga', slug: 'yoga', icon: '🧘' },
        ],
      },
      {
        name: 'Beauty & Personal Care',
        slug: 'beauty',
        icon: '💄',
        description: 'Makeup, skincare, hair care, and fragrance',
        isFeatured: false,
        children: [
          { name: 'Skincare', slug: 'skincare', icon: '🧴' },
          { name: 'Makeup', slug: 'makeup', icon: '💋' },
          { name: 'Hair Care', slug: 'hair-care', icon: '💇' },
          { name: 'Fragrance', slug: 'fragrance', icon: '🌸' },
        ],
      },
    ];

    for (const categoryData of categories) {
      const { children, ...parentData } = categoryData;

      // Check if category exists
      let category = await this.categoryRepository.findOne({
        where: { slug: parentData.slug },
      });

      if (!category) {
        category = this.categoryRepository.create(parentData);
        category = await this.categoryRepository.save(category);
        this.logger.log(`Created category: ${category.name}`);
      }

      // Create children
      for (const childData of children) {
        let child = await this.categoryRepository.findOne({
          where: { slug: childData.slug },
        });

        if (!child) {
          child = this.categoryRepository.create({
            ...childData,
            parent: category,
          });
          await this.categoryRepository.save(child);
          this.logger.log(`  Created subcategory: ${child.name}`);
        }
      }
    }

    this.logger.log('Categories seeded successfully!');
  }
}
