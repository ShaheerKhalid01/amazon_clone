import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CategoriesSeed } from './categories.seed';
import { ProductsSeed } from './products.seed';

/**
 * Seed Runner
 * Executes all seed files in order
 */
@Injectable()
export class SeedRunner implements OnModuleInit {
  private readonly logger = new Logger(SeedRunner.name);

  constructor(
    private readonly categoriesSeed: CategoriesSeed,
    private readonly productsSeed: ProductsSeed,
  ) {}

  async onModuleInit() {
    // Only run seeds in development
    if (process.env.NODE_ENV === 'development') {
      await this.runSeeds();
    }
  }

  async runSeeds() {
    this.logger.log('🌱 Running database seeds...');

    try {
      // Run in order (categories first due to dependencies)
      await this.categoriesSeed.seed();
      await this.productsSeed.seed();

      this.logger.log('✅ All seeds completed successfully!');
    } catch (error) {
      this.logger.error('❌ Seed failed:', error.message);
    }
  }
}
