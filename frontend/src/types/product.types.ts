import { ProductCategory, ProductCondition, ProductAvailability } from '@shared/enums';

// Full product types for frontend

export { ProductCategory, ProductCondition, ProductAvailability };

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

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: 'cm' | 'in';
    weightUnit: 'g' | 'kg' | 'lb' | 'oz';
  }
  
  export interface ProductImage {
    id: string;
    url: string;
    thumbnailUrl: string;
    altText: string;
    isPrimary: boolean;
    order: number;
    dimensions?: {
      width: number;
      height: number;
    };
  }
  
  export interface ProductVariant {
    id: string;
    sku: string;
    optionValues: Record<string, string>;
    price: number;
    compareAtPrice?: number;
    quantity: number;
    availability: ProductAvailability;
    images?: ProductImage[];
    isDefault: boolean;
  }
  
  export interface ProductOption {
    name: string;
    values: string[];
    type: 'dropdown' | 'color' | 'button' | 'radio';
  }
  
  export interface ProductReview {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
    verifiedPurchase: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    variantInfo?: Record<string, string>;
    createdAt: string;
    isAmazonVine: boolean;
    isTopContributor: boolean;
  }
  
  export interface ReviewSummary {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
    percentageRecommend: number;
  }
  
  export interface ShippingInfo {
    freeShipping: boolean;
    freeShippingThreshold?: number;
    shippingCost?: number;
    estimatedDelivery: {
      standard: DeliveryEstimate;
      expedited?: DeliveryEstimate;
      twoDay?: DeliveryEstimate;
      oneDay?: DeliveryEstimate;
    };
    shipsFrom: string;
    internationalShipping: boolean;
  }
  
  export interface DeliveryEstimate {
    minDays: number;
    maxDays: number;
    cutOffTime?: string;
    businessDays: boolean;
  }
  
  export interface AmazonFeatures {
    isPrimeEligible: boolean;
    isAmazonChoice: boolean;
    isBestSeller: boolean;
    isAmazonBrand: boolean;
    hasCoupon: boolean;
    couponValue?: number;
    couponType?: 'percentage' | 'fixed';
    isSubscribeAndSave: boolean;
    subscribeAndSaveDiscount?: number;
    isClimatePledgeFriendly: boolean;
    isAlexaEnabled: boolean;
    isAmazonFresh: boolean;
    tradeInEligible: boolean;
    tradeInValue?: number;
  }
  
  export interface ProductBadge {
    type: 'BEST_SELLER' | 'AMAZON_CHOICE' | 'NEW_ARRIVAL' | 'LIMITED_TIME_DEAL' | 
          'EXCLUSIVE' | 'COUPON' | 'SALE' | 'PRIME_EXCLUSIVE' | 'ECO_FRIENDLY' | 
          'SMALL_BUSINESS' | 'HANDMADE' | 'TOP_RATED';
    text: string;
    color?: string;
    icon?: string;
  }
  
  export interface ProductSpecifications {
    [category: string]: {
      label: string;
      specifications: {
        name: string;
        value: string;
        unit?: string;
      }[];
    };
  }
  
  // Main Product Type
  export interface Product {
    id: string;
    asin: string;
    title: string;
    subtitle?: string;
    brand: string;
    manufacturer: string;
    description: string;
    bulletPoints: string[];
    longDescription?: string;
    category: ProductCategory;
    subCategory: string;
    tags: string[];
    pricing: PricingInfo;
    variants: ProductVariant[];
    options: ProductOption[];
    images: ProductImage[];
    videos?: ProductVideo[];
    shipping: ShippingInfo;
    reviewSummary: ReviewSummary;
    reviews?: ProductReview[];
    condition: ProductCondition;
    availability: ProductAvailability;
    specifications: ProductSpecifications;
    dimensions: ProductDimensions;
    warranty?: string;
    amazonFeatures: AmazonFeatures;
    badges?: ProductBadge[];
    sellerId: string;
    sellerName: string;
    sellerRating?: number;
    totalQuantity: number;
    relatedProducts?: string[];
    frequentlyBoughtTogether?: string[];
    features?: string[];
    warnings?: string;
    originCountry: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductVideo {
    id: string;
    url: string;
    thumbnailUrl: string;
    title: string;
    duration: number;
    type: 'product_review' | 'unboxing' | 'tutorial' | 'promotional';
  }
  
  // Simplified product for listings
  export interface ProductListing {
    id: string;
    asin: string;
    title: string;
    brand: string;
    primaryImage: ProductImage;
    pricing: {
      currentPrice: number;
      originalPrice?: number;
      savings?: number;
      savingsPercentage?: number;
    };
    rating: number;
    reviewCount: number;
    isPrimeEligible: boolean;
    isBestSeller: boolean;
    isAmazonChoice: boolean;
    badges?: ProductBadge[];
    availability: ProductAvailability;
    deliveryInfo?: {
      fastestDays: number;
      freeShipping: boolean;
    };
    category: ProductCategory;
    subCategory: string;
  }
  
  export interface ProductFilters {
    category?: string | ProductCategory;
    categories?: ProductCategory[];
    subCategories?: string[];
    brands?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    rating?: number;
    availability?: ProductAvailability[];
    conditions?: ProductCondition[];
    primeEligible?: boolean;
    amazonChoice?: boolean;
    onSale?: boolean;
    freeShipping?: boolean;
    fulfillmentType?: 'FBA' | 'FBM';
    features?: string[];
    colors?: string[];
    sizes?: string[];
  }
  
  export interface ProductSortOption {
    field: 'price' | 'rating' | 'reviewCount' | 'createdAt' | 'bestseller' | 'relevance';
    direction: 'asc' | 'desc';
    label: string;
  }
