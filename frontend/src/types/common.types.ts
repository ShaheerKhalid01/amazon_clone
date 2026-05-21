// Common utility types

export interface SortOption {
    field: string;
    direction: 'asc' | 'desc';
    label: string;
  }
  
  export interface FilterOption {
    id: string;
    label: string;
    value: string;
    count?: number;
    selected?: boolean;
  }
  
  export interface Image {
    id: string;
    url: string;
    thumbnailUrl: string;
    altText: string;
    isPrimary: boolean;
    width?: number;
    height?: number;
  }
  
  export interface Address {
    id: string;
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    apartment?: string;
    landmark?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    addressType: 'HOME' | 'WORK' | 'OTHER';
    deliveryInstructions?: string;
  }
