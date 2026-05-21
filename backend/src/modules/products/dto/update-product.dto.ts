import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * Update Product DTO
 * All fields are optional for partial updates
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
