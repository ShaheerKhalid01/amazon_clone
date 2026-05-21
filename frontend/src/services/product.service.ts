import apiService from './api';
import type { 
  Product, 
  ProductListing, 
  ProductFilters, 
  ProductReview 
} from '@/types/product.types';

/**
 * Product Service
 * Handles product-related API calls
 */
class ProductService {
  private readonly PRODUCT_URL = '/products';

  /**
   * Get products with filters
   */
  async getProducts(filters?: ProductFilters): Promise<{
    products: ProductListing[];
    pagination: any;
  }> {
    return apiService.get(this.PRODUCT_URL, filters);
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    return apiService.get<Product>(`${this.PRODUCT_URL}/${id}`);
  }

  /**
   * Get product by ASIN
   */
  async getProductByAsin(asin: string): Promise<Product> {
    return apiService.get<Product>(`${this.PRODUCT_URL}/asin/${asin}`);
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 10): Promise<ProductListing[]> {
    return apiService.get(`${this.PRODUCT_URL}/featured`, { limit });
  }

  /**
   * Get deals
   */
  async getDeals(limit = 20): Promise<ProductListing[]> {
    return apiService.get(`${this.PRODUCT_URL}/deals`, { limit });
  }

  /**
   * Get related products
   */
  async getRelatedProducts(productId: string, limit = 10): Promise<ProductListing[]> {
    return apiService.get(
      `${this.PRODUCT_URL}/${productId}/related`,
      { limit },
    );
  }

  /**
   * Search products
   */
  async searchProducts(keyword: string, filters?: any): Promise<any> {
    return apiService.get('/search', {
      q: keyword,
      ...filters,
    });
  }

  /**
   * Add product review
   */
  async addReview(
    productId: string,
    reviewData: Partial<ProductReview>,
  ): Promise<ProductReview> {
    return apiService.post<ProductReview>(
      `${this.PRODUCT_URL}/${productId}/reviews`,
      reviewData,
    );
  }
}

export const productService = new ProductService();
export default productService;
