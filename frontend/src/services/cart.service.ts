import apiService from './api';
import type { Cart, AddToCartPayload } from '../types/cart.types';

class CartService {
  async getCart(): Promise<Cart> {
    return apiService.get<Cart>('/cart');
  }

  async addToCart(payload: AddToCartPayload): Promise<Cart> {
    return apiService.post<Cart>('/cart/add', payload);
  }

  async removeFromCart(productId: string): Promise<void> {
    await apiService.delete(`/cart/remove/${productId}`);
  }

  async updateQuantity(productId: string, quantity: number): Promise<Cart> {
    return apiService.put<Cart>('/cart/update', { productId, quantity });
  }
}

export const cartService = new CartService();
export default cartService;
