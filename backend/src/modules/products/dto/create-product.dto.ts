import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsEnum,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ProductCategory,
  ProductCondition,
  ProductAvailability,
} from '@shared/enums';

/**
 * Product Dimensions DTO
 */
class ProductDimensionsDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  height: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({ example: 'cm' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 'g' })
  @IsString()
  weightUnit: string;
}

/**
 * Product Image DTO
 */
class ProductImageDto {
  @ApiProperty({ example: 'img-1' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'https://example.com/thumb.jpg' })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({ example: 'Red t-shirt front view' })
  @IsString()
  altText: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPrimary: boolean;

  @ApiProperty({ example: 0 })
  @IsNumber()
  order: number;
}

/**
 * Create Product DTO
 */
export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Bluetooth Headphones' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({ example: 'Premium Sound Quality' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subtitle?: string;

  @ApiProperty({ example: 'AudioTech' })
  @IsString()
  @MaxLength(100)
  brand: string;

  @ApiProperty({ example: 'AudioTech Inc.' })
  @IsString()
  @MaxLength(100)
  manufacturer: string;

  @ApiProperty({
    example: 'High-quality wireless headphones with noise cancellation...',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    example: ['Noise cancellation', '30hr battery', 'Bluetooth 5.0'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  bulletPoints: string[];

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.ELECTRONICS })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ example: 'Headphones' })
  @IsString()
  subCategory: string;

  @ApiPropertyOptional({ example: ['wireless', 'bluetooth', 'audio'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 149.99 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ example: 99.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({ example: 199.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  totalQuantity: number;

  @ApiProperty({ enum: ProductCondition, example: ProductCondition.NEW })
  @IsEnum(ProductCondition)
  condition: ProductCondition;

  @ApiProperty({
    enum: ProductAvailability,
    example: ProductAvailability.IN_STOCK,
  })
  @IsEnum(ProductAvailability)
  availability: ProductAvailability;

  @ApiProperty({ type: [ProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @ApiProperty({ type: ProductDimensionsDto })
  @ValidateNested()
  @Type(() => ProductDimensionsDto)
  dimensions: ProductDimensionsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrimeEligible?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAmazonChoice?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasCoupon?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  couponValue?: number;
}
