import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('orders/:orderId/status')
  @ApiOperation({ summary: 'Payment status for an order (stub)' })
  async status(@Param('orderId') orderId: string) {
    return this.paymentsService.getStatus(orderId);
  }
}
