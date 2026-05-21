// Search related types

import type { FilterOption } from './common.types';
import type { ProductCategory } from '@shared/enums';
import type { ProductFilters, ProductSortOption, ProductListing } from './product.types';

export interface SearchQuery {
    keyword: string;
    category?: ProductCategory;
    filters?: ProductFilters;
    sort?: ProductSortOption;
    page: number;
    limit: number;
  }
  
  export interface SearchSuggestion {
    text: string;
    type: 'keyword' | 'product' | 'category' | 'brand';
    highlighted?: string;
    productCount?: number;
  }
  
  export interface SearchFilters {
    categories: FilterOption[];
    brands: FilterOption[];
    priceRanges: {
      min: number;
      max: number;
      count: number;
      label: string;
    }[];
    ratings: {
      stars: number;
      count: number;
      percentage: number;
    }[];
    conditions: FilterOption[];
    availability: FilterOption[];
    features: FilterOption[];
    primeEligible: boolean;
  }

  export interface SearchResults {
    products: ProductListing[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
    filters: SearchFilters;
    sortOptions: ProductSortOption[];
    activeSort?: ProductSortOption;
    didYouMean?: string;
    relatedSearches: string[];
    sponsoredProducts?: ProductListing[];
  }
