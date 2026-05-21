// Product related types used across frontend and backend

import type { Image } from './common.types';

export type ProductCategory = 
  | 'ELECTRONICS'
  | 'FASHION'
  | 'HOME_KITCHEN'
  | 'BOOKS'
  | 'SPORTS_OUTDOORS'
  | 'HEALTH_PERSONAL_CARE'
  | 'TOYS_GAMES'
  | 'AUTOMOTIVE'
  | 'GROCERY'
  | 'BEAUTY'
  | 'PET_SUPPLIES'
  | 'OFFICE_PRODUCTS';

export type ProductCondition = 
  | 'NEW'
  | 'RENEWED'
  | 'USED_LIKE_NEW'
  | 'USED_VERY_GOOD'
  | 'USED_GOOD'
  | 'USED_ACCEPTABLE'
  | 'REFURBISHED';

export type ProductAvailability = 
  | 'IN_STOCK'
  | 'OUT_OF_STOCK'
  | 'PRE_ORDER'
  | 'BACK_ORDERED'
  | 'TEMPORARILY_UNAVAILABLE';

export interface PricingInfo {
  basePrice: number;
  salePrice?: number;
  compareAtPrice?: number;
  savingsPercentage?: number;
  isOnSale: boolean;
  couponDiscount?: number;
  subscriptionPrice?: number;
  primePrice?: number;
  currency: string;
}

export interface ProductBase {
  id: string;
  title: string;
  brand: string;
  description: string;
  category: ProductCategory;
  pricing: PricingInfo;
  condition: ProductCondition;
  availability: ProductAvailability;
  images: Image[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}