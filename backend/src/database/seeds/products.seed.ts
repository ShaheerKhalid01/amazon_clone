import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../modules/products/entities/product.entity';
import { ProductAvailability, ProductCategory } from '@shared/enums';

/**
 * Products Seed Data
 */
@Injectable()
export class ProductsSeed {
  private readonly logger = new Logger(ProductsSeed.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async seed() {
    this.logger.log('Seeding products...');

    const products = [
      {
        asin: 'B08N5WRWNW',
        title: 'Wireless Bluetooth Headphones - Premium Sound Quality',
        brand: 'AudioTech',
        manufacturer: 'AudioTech Inc.',
        description:
          'Experience crystal-clear audio with these premium wireless headphones featuring active noise cancellation, 40-hour battery life, and comfortable over-ear design.',
        bulletPoints: [
          '🎵 Premium Hi-Fi Sound Quality with Deep Bass',
          '🔇 Active Noise Cancellation (ANC) Technology',
          '🔋 40 Hours Battery Life with Quick Charge',
          '🎮 Low Latency Mode for Gaming',
          '📞 Built-in HD Microphone for Crystal Clear Calls',
        ],
        category: 'ELECTRONICS',
        subCategory: 'Headphones',
        basePrice: 99.99,
        compareAtPrice: 149.99,
        isOnSale: true,
        totalQuantity: 500,
        condition: 'NEW',
        availability: 'IN_STOCK',
        isPrimeEligible: true,
        isBestSeller: true,
        isAmazonChoice: true,
        averageRating: 4.5,
        totalReviews: 2341,
      },
      {
        asin: 'B08N5WRWNX',
        title: 'Premium Yoga Mat - Non-Slip Exercise Mat',
        brand: 'FitLife',
        manufacturer: 'FitLife Sports',
        description:
          'Professional-grade yoga mat with superior cushioning and non-slip surface. Perfect for yoga, pilates, and all floor exercises.',
        bulletPoints: [
          '🧘 Extra Thick 6mm Premium Material',
          '🔄 Double-Sided Non-Slip Surface',
          '💪 High Density for Joint Protection',
          '🧼 Easy to Clean and Maintain',
          '🎒 Includes Carrying Strap',
        ],
        category: ProductCategory.SPORTS_OUTDOORS,
        subCategory: 'Yoga',
        basePrice: 49.99,
        totalQuantity: 300,
        condition: 'NEW',
        availability: 'IN_STOCK',
        isPrimeEligible: true,
        isBestSeller: true,
        averageRating: 4.8,
        totalReviews: 1856,
      },
      {
        asin: 'B08N5WRWNY',
        title: 'Ergonomic Gaming Laptop Stand - Aluminum',
        brand: 'TechPro',
        manufacturer: 'TechPro Accessories',
        description:
          'Adjustable aluminum laptop stand designed for gamers and professionals. Improves posture and laptop cooling.',
        bulletPoints: [
          '🔧 Adjustable Height (7 Levels)',
          '💨 Open Design for Maximum Airflow',
          '🛡️ Sturdy Aluminum Construction',
          '📱 Fits 10-17 inch Laptops',
          '✨ Sleek Space Gray Finish',
        ],
        category: ProductCategory.ELECTRONICS,
        subCategory: 'Computer Accessories',
        basePrice: 79.99,
        compareAtPrice: 99.99,
        isOnSale: true,
        totalQuantity: 200,
        condition: 'NEW',
        availability: 'IN_STOCK',
        isPrimeEligible: false,
        averageRating: 4.3,
        totalReviews: 892,
      },
      {
        asin: 'B08N5WRWNZ',
        title: 'Stainless Steel French Press Coffee Maker',
        brand: 'BrewMaster',
        manufacturer: 'BrewMaster Kitchen',
        description:
          'Double-walled stainless steel French press that keeps coffee hot for hours. Makes 4 cups of rich, full-bodied coffee.',
        bulletPoints: [
          '☕ Double-Wall Insulation Keeps Coffee Hot',
          '🔧 Stainless Steel - No Glass to Break',
          '🧹 Easy to Clean Filter System',
          '📏 34oz / 1 Liter Capacity (4 Cups)',
          '🌿 BPA-Free Materials',
        ],
        category: ProductCategory.HOME_KITCHEN,
        subCategory: 'Coffee Makers',
        basePrice: 34.99,
        totalQuantity: 150,
        condition: 'NEW',
        availability: 'IN_STOCK',
        isPrimeEligible: true,
        averageRating: 4.6,
        totalReviews: 1234,
      },
      {
        asin: 'B08N5WRWOA',
        title: 'Running Shoes - Lightweight Athletic Sneakers',
        brand: 'StrideX',
        manufacturer: 'StrideX Athletics',
        description:
          'Ultra-lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for daily training and races.',
        bulletPoints: [
          '👟 Lightweight Design (8.5 oz)',
          '💨 Breathable Mesh Upper',
          '🦶 Responsive Cushioning Technology',
          '🏃 Flexible Outsole for Natural Movement',
          '🎨 Available in Multiple Colors',
        ],
        category: ProductCategory.FASHION,
        subCategory: 'Athletic Shoes',
        basePrice: 89.99,
        compareAtPrice: 119.99,
        isOnSale: true,
        totalQuantity: 400,
        condition: 'NEW',
        availability: 'IN_STOCK',
        isPrimeEligible: true,
        averageRating: 4.4,
        totalReviews: 3456,
      },
    ];

    for (const productData of products) {
      const existing = await this.productRepository.findOne({
        where: { asin: productData.asin },
      });

      if (!existing) {
        const product = this.productRepository.create({
          ...(productData as any),
          sellerId: 'seed-seller-1',
          sellerName: 'Amazon Clone Official',
          images: [
            {
              id: 'img-1',
              url: 'https://picsum.photos/400/400?random=1',
              thumbnailUrl: 'https://picsum.photos/100/100?random=1',
              altText: productData.title,
              isPrimary: true,
              order: 0,
            },
            {
              id: 'img-2',
              url: 'https://picsum.photos/400/400?random=2',
              thumbnailUrl: 'https://picsum.photos/100/100?random=2',
              altText: `${productData.title} - View 2`,
              isPrimary: false,
              order: 1,
            },
          ],
          dimensions: {
            length: 10,
            width: 5,
            height: 3,
            weight: 500,
            unit: 'in',
            weightUnit: 'g',
          },
          shipping: {
            freeShipping: true,
            estimatedDelivery: {
              minDays: 3,
              maxDays: 5,
            },
            shipsFrom: 'US',
            internationalShipping: false,
          },
          ratingDistribution: {
            1: Math.floor(Math.random() * 100),
            2: Math.floor(Math.random() * 200),
            3: Math.floor(Math.random() * 300),
            4: Math.floor(Math.random() * 500),
            5: Math.floor(Math.random() * 1000),
          },
        }) as unknown as Product;

        await this.productRepository.save(product);
        this.logger.log(`Created product: ${product.title}`);
      }
    }

    this.logger.log('Products seeded successfully!');
  }
}
