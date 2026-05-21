import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@shared/enums';

/**
 * Products Controller
 * REST API for product management
 */
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  // ===== PUBLIC ENDPOINTS =====

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() filters: ProductFilterDto) {
    this.logger.log(
      `Fetching products with filters: ${JSON.stringify(filters)}`,
    );
    return this.productsService.findAll(filters);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFeatured(@Query('limit') limit = 10) {
    return this.productsService.getFeatured(limit);
  }

  @Public()
  @Get('deals')
  @ApiOperation({ summary: 'Get products on sale' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getDeals(@Query('limit') limit = 20) {
    return this.productsService.getDeals(limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findById(id);
  }

  @Public()
  @Get('asin/:asin')
  @ApiOperation({ summary: 'Get product by ASIN' })
  @ApiParam({ name: 'asin', description: 'Product ASIN' })
  async findByAsin(@Param('asin') asin: string) {
    return this.productsService.findByAsin(asin);
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async getRelated(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit = 10,
  ) {
    return this.productsService.getRelated(id, limit);
  }

  @Public()
  @Get(':id/variants')
  @ApiOperation({ summary: 'Get product variants' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async getVariants(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getVariants(id);
  }

  // ===== SELLER ENDPOINTS =====

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new product (Seller only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: any,
  ) {
    this.logger.log(`Creating product by seller: ${user.email}`);
    return this.productsService.create(
      createProductDto,
      user.sub,
      `${user.firstName} ${user.lastName}`,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a product (Seller only)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.productsService.update(id, updateProductDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a product (Seller only)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') userId: string,
  ) {
    await this.productsService.delete(id, userId);
    return { message: 'Product deleted successfully' };
  }

  @Put(':id/inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update product inventory' })
  async updateInventory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() inventoryData: { quantity: number; variantId?: string },
  ) {
    await this.productsService.updateInventory(
      id,
      inventoryData.quantity,
      inventoryData.variantId,
    );
    return { message: 'Inventory updated successfully' };
  }

  // ===== REVIEW ENDPOINTS =====

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add product review' })
  async addReview(
    @Param('id', ParseUUIDPipe) productId: string,
    @CurrentUser('sub') userId: string,
    @Body() reviewData: any,
  ) {
    return this.productsService.addReview(productId, userId, reviewData);
  }
}
