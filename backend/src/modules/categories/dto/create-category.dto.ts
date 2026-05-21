import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

/**
 * Create Category DTO
 */
export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'electronics' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug: string;

  @ApiPropertyOptional({ example: 'All electronic devices and accessories' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/icon.png' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: '🖥️' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metaData?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/**
 * Update Category DTO
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
