import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SellerService } from './seller.service';

@ApiTags('Seller')
@ApiBearerAuth()
@Controller('seller')
@UseGuards(JwtAuthGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Seller dashboard summary' })
  dashboard(@CurrentUser('id') sellerId: string) {
    return this.sellerService.getDashboardStats(sellerId);
  }
}
