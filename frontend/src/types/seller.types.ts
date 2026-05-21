import type { Order } from './order.types';

// Seller related types

export interface SellerInfo {
    id: string;
    storeName: string;
    description: string;
    logo?: string;
    rating: number;
    totalRatings: number;
    joinedDate: string;
    location: string;
    policies: {
      returnPolicy: string;
      shippingPolicy: string;
      privacyPolicy: string;
    };
    shippingRates: {
      domestic: number;
      international: number;
      freeShippingThreshold: number;
    };
    averageShippingTime: number;
    responseRate: number;
  }
  
  export interface SellerDashboard {
    totalProducts: number;
    activeProducts: number;
    totalSales: number;
    totalRevenue: number;
    averageRating: number;
    recentOrders: Order[];
    inventoryAlerts: {
      productId: string;
      title: string;
      currentStock: number;
      threshold: number;
    }[];
  }
