import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

/**
 * Wishlist Service
 */
@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  /**
   * Get user wishlist
   */
  async getList(userId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!wishlist) {
      wishlist = this.wishlistRepository.create({
        userId,
        items: [],
        itemCount: 0,
      });
      await this.wishlistRepository.save(wishlist);
    }

    return wishlist;
  }

  /**
   * Add item to wishlist
   */
  async addItem(
    userId: string,
    productId: string,
    variantId?: string,
  ): Promise<Wishlist> {
    const wishlist = await this.getList(userId);

    // Check if already in wishlist
    const existingItem = wishlist.items.find(
      (item) => item.productId === productId && item.variantId === variantId,
    );

    if (!existingItem) {
      wishlist.items.push({
        productId,
        variantId,
        addedAt: new Date(),
        priority: 'MEDIUM',
        quantity: 1,
        isPublic: true,
      });
      wishlist.itemCount = wishlist.items.length;
      wishlist.updatedAt = new Date();

      await this.wishlistRepository.save(wishlist);
    }

    return wishlist;
  }

  /**
   * Remove item from wishlist
   */
  async removeItem(userId: string, productId: string): Promise<void> {
    const wishlist = await this.getList(userId);

    wishlist.items = wishlist.items.filter(
      (item) => item.productId !== productId,
    );
    wishlist.itemCount = wishlist.items.length;
    wishlist.updatedAt = new Date();

    await this.wishlistRepository.save(wishlist);
  }
}
