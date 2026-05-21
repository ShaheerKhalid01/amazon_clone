import type { ProductAvailability } from '@shared/enums';
import type { ProductImage } from './product.types';

// Wishlist types

export interface WishlistItem {
    id: string;
    productId: string;
    variantId?: string;
    product: {
      id: string;
      title: string;
      image: ProductImage;
      brand: string;
      rating: number;
      reviewCount: number;
    };
    pricing: {
      currentPrice: number;
      originalPrice?: number;
      isOnSale: boolean;
      isPrimeEligible: boolean;
    };
    availability: ProductAvailability;
    addedAt: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    notes?: string;
    quantity: number;
    isPublic: boolean;
  }
  
  export interface Wishlist {
    id: string;
    userId: string;
    name: string;
    description?: string;
    items: WishlistItem[];
    isPublic: boolean;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
  }
