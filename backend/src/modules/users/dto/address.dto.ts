import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

/**
 * Create Address DTO
 */
export class CreateAddressDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' })
  phoneNumber: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @MaxLength(255)
  streetAddress: string;

  @ApiPropertyOptional({ example: 'Apt 4B' })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiPropertyOptional({ example: 'Near Central Park' })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  state: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  zipCode: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  country: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ enum: ['HOME', 'WORK', 'OTHER'] })
  @IsOptional()
  @IsEnum(['HOME', 'WORK', 'OTHER'])
  addressType?: 'HOME' | 'WORK' | 'OTHER';

  @ApiPropertyOptional({ example: 'Leave at the front door' })
  @IsOptional()
  @IsString()
  deliveryInstructions?: string;
}

/**
 * Update Address DTO
 */
export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
