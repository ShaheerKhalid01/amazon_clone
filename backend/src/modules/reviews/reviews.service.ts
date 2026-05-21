import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  async listByProduct(productId: string) {
    return {
      productId,
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    };
  }
}
