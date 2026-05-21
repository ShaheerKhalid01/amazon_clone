import { useState, useEffect, useCallback } from 'react';
import { productService } from '@services/product.service';
import type { Product } from '@/types/product.types';

/**
 * Custom hook for fetching a single product
 */
export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (showLoading = true) => {
    if (!productId) return;

    try {
      if (showLoading) setLoading(true);
      setError(null);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      setProduct(null);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    // We use a local flag to avoid setting state if component unmounts
    let isMounted = true;
    
    const loadData = async () => {
      if (!productId) return;
      
      try {
        // Initial load without explicit setLoading(true) in body to avoid lint error
        // or just use the callback but be careful
        const data = await productService.getProductById(productId);
        if (isMounted) setProduct(data);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch product');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
