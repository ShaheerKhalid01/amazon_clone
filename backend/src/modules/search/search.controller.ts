import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

/**
 * Search Controller
 */
@ApiTags('Search')
@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'rating', required: false })
  @ApiQuery({ name: 'condition', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async search(@Query() query: any) {
    this.logger.log(`Search query: ${JSON.stringify(query)}`);
    return this.searchService.search(query);
  }

  @Public()
  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiQuery({ name: 'keyword', required: true })
  async getSuggestions(@Query('keyword') keyword: string) {
    return this.searchService.getSuggestions(keyword);
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending searches' })
  async getTrending() {
    return this.searchService.getTrendingSearches();
  }

  @Public()
  @Get('related')
  @ApiOperation({ summary: 'Get related searches' })
  @ApiQuery({ name: 'keyword', required: true })
  async getRelated(@Query('keyword') keyword: string) {
    return this.searchService.getRelatedSearches(keyword);
  }

  @Public()
  @Get('filters')
  @ApiOperation({ summary: 'Get search filters' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'category', required: false })
  async getFilters(
    @Query('keyword') keyword: string = '',
    @Query('category') category?: string,
  ) {
    return this.searchService.getSearchFilters(keyword, category);
  }
}
