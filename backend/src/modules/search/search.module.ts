import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

/**
 * Search Module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
