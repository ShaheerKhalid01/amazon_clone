export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  USER = 'USER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum MembershipTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export enum ProductAvailability {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PREORDER = 'PREORDER',
}

export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  FASHION = 'FASHION',
  HOME = 'HOME',
  BOOKS = 'BOOKS',
  TOYS = 'TOYS',
}
