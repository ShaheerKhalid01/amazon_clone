import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductReview } from './entities/product-review.entity';

/**
 * Products Module
 * Handles product catalog, variants, and reviews
 */
@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductVariant, ProductReview])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
