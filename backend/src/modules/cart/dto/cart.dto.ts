import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Add to Cart DTO
 */
export class AddToCartDto {
  @ApiProperty({ example: 'uuid-of-product' })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({ example: 'uuid-of-variant' })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 50 })
  @IsNumber()
  @Min(1)
  @Max(50)
  quantity: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isGift?: boolean;

  @ApiPropertyOptional({ example: 'Happy Birthday!' })
  @IsOptional()
  @IsString()
  giftMessage?: string;
}

/**
 * Update Cart Item DTO
 */
export class UpdateCartItemDto {
  @ApiProperty({ example: 'uuid-of-product' })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  quantity?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isGift?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  giftMessage?: string;
}

/**
 * Apply Coupon DTO
 */
export class ApplyCouponDto {
  @ApiProperty({ example: 'SAVE20' })
  @IsString()
  code: string;
}
