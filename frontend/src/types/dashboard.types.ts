// Dashboard & Analytics types

import type { OrderStatus } from './order.types';
import type { ProductListing } from './product.types';

export interface DashboardStats {
    totalOrders: number;
    activeOrders: number;
    totalSpent: number;
    wishlistItems: number;
    reviewCount: number;
    primeBenefits: {
      usedFreeShipping: number;
      savedWithPrime: number;
      streamedContent: number;
    };
  }
  
  export interface RecentOrder {
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: {
      title: string;
      image: string;
      quantity: number;
    }[];
    trackingNumber?: string;
  }
  
  export interface Recommendation {
    id: string;
    type: 'BASED_ON_HISTORY' | 'FREQUENTLY_BOUGHT' | 'TRENDING' | 'DEALS';
    products: ProductListing[];
    title: string;
    description?: string;
  }
