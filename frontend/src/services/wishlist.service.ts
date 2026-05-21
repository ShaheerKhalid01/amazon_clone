import apiService from './api';
import type { Wishlist, WishlistItem } from '@/types/wishlist.types';

class WishlistService {
  private readonly WISHLIST_URL = '/wishlist';

  async getWishlist(): Promise<Wishlist> {
    return apiService.get<Wishlist>(this.WISHLIST_URL);
  }

  async addItem(productId: string, variantId?: string): Promise<Wishlist> {
    return apiService.post<Wishlist>(`${this.WISHLIST_URL}/add`, { productId, variantId });
  }

  async removeItem(productId: string): Promise<void> {
    await apiService.delete(`${this.WISHLIST_URL}/remove/${productId}`);
  }

  async clearWishlist(): Promise<void> {
    await apiService.delete(this.WISHLIST_URL);
  }
}

export const wishlistService = new WishlistService();
export default wishlistService;
