import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

/**
 * Recommendations Controller
 */
@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('personalized')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get personalized recommendations' })
  @ApiQuery({ name: 'limit', required: false })
  async getPersonalized(
    @CurrentUser('sub') userId: string,
    @Query('limit') limit = 10,
  ) {
    return this.recommendationsService.getPersonalizedRecommendations(
      userId,
      limit,
    );
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Get popular products' })
  @ApiQuery({ name: 'limit', required: false })
  async getPopular(@Query('limit') limit = 10) {
    return this.recommendationsService.getPopularProducts(limit);
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending products' })
  @ApiQuery({ name: 'limit', required: false })
  async getTrending(@Query('limit') limit = 10) {
    return this.recommendationsService.getTrendingProducts(limit);
  }

  @Public()
  @Get('frequently-bought/:productId')
  @ApiOperation({ summary: 'Get frequently bought together' })
  async getFrequentlyBought(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('limit') limit = 5,
  ) {
    return this.recommendationsService.getFrequentlyBoughtTogether(
      productId,
      limit,
    );
  }

  @Public()
  @Get('similar/:productId')
  @ApiOperation({ summary: 'Get similar products' })
  async getSimilar(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('limit') limit = 8,
  ) {
    return this.recommendationsService.getSimilarProducts(productId, limit);
  }

  @Public()
  @Get('category/:category')
  @ApiOperation({ summary: 'Get category recommendations' })
  async getCategoryRecommendations(
    @Param('category') category: string,
    @Query('limit') limit = 10,
  ) {
    return this.recommendationsService.getCategoryRecommendations(
      category,
      limit,
    );
  }
}
