import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async getStatus(orderId: string) {
    return {
      orderId,
      status: 'idle',
      provider: 'stub',
    };
  }
}
