// Notification types

export type NotificationType = 
  | 'ORDER_UPDATE'
  | 'PRICE_DROP'
  | 'BACK_IN_STOCK'
  | 'DEAL_ALERT'
  | 'SHIPPING_UPDATE'
  | 'REVIEW_REQUEST'
  | 'PROMOTIONAL'
  | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  image?: string;
  data?: Record<string, string>;
  createdAt: string;
}
