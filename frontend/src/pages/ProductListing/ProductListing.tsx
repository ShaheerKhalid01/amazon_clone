import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductGrid from '@components/product/ProductGrid/ProductGrid';
import { FaSpinner } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('q') || '';

  // ── Real products fetch karein MongoDB se ──────────────────────────────
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          setAllProducts(json.data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (category) {
      result = result.filter(p =>
        (p.category || 'ELECTRONICS').toLowerCase() === category.toLowerCase() ||
        (p.category || 'ELECTRONICS').toLowerCase().includes(category.toLowerCase())
      );
    }

    if (keyword) {
      result = result.filter(p =>
        p.title?.toLowerCase()?.includes(keyword.toLowerCase())
      );
    }

    return result;
  }, [allProducts, category, keyword]);

  // 👇 UPDATED: MongoDB ke simple document ko ProductGrid ke expected shape mein convert kiya
  const formattedProducts = filteredProducts.map(p => {
    const currentPrice = p.salePrice && p.salePrice < p.basePrice ? p.salePrice : p.basePrice || 0;
    const savingsPercentage = p.salePrice && p.salePrice < p.basePrice
      ? Math.round(((p.basePrice - p.salePrice) / p.basePrice) * 100)
      : 0;

    return {
      id: p._id,
      asin: p._id,
      title: p.title,
      brand: p.brand,
      primaryImage: p.image
        ? { url: p.image, thumbnailUrl: p.image, altText: p.title, isPrimary: true, order: 0 }
        : { url: 'https://via.placeholder.com/400', thumbnailUrl: 'https://via.placeholder.com/100', altText: p.title, isPrimary: true, order: 0 },
      pricing: {
        currentPrice,
        originalPrice: savingsPercentage > 0 ? p.basePrice : undefined,
        savingsPercentage,
      },
      rating: p.rating || 0,
      reviewCount: p.totalReviews || 0,
      isPrimeEligible: true,
      isBestSeller: !!p.isBestSeller,
      isAmazonChoice: false,
      badges: [],
      availability: p.isActive === false ? 'OUT_OF_STOCK' : 'IN_STOCK',
      deliveryInfo: { fastestDays: 3, freeShipping: true },
      category: p.category || 'ELECTRONICS',
      subCategory: '',
    };
  });

  const categoryDisplay = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : '';

  return (
    <div className="max-w-amazon mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {categoryDisplay || keyword ? `Results for "${keyword || categoryDisplay}"` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? 'Loading...' : `${filteredProducts.length} products found`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <FaSpinner className="animate-spin mr-2" size={24} /> Loading products...
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={formattedProducts} loading={false} variant={viewMode} columns={4} />
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">Try a different category</p>
          <Link to="/products" className="text-amazon-blue hover:underline mt-4 inline-block">Browse All Products</Link>
        </div>
      )}
    </div>
  );
};

export default ProductListing;