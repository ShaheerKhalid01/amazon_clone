import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductGrid from '@components/product/ProductGrid/ProductGrid';
import { mockProducts } from '@services/mockData';

const ProductListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (category) {
      result = result.filter(p => 
        p.category?.toLowerCase() === category?.toUpperCase() ||
        p.category?.toLowerCase()?.includes(category?.toLowerCase())
      );
    }

    if (keyword) {
      result = result.filter(p => 
        p.title?.toLowerCase()?.includes(keyword?.toLowerCase())
      );
    }

    return result;
  }, [category, keyword]);

  const formattedProducts = filteredProducts.map(p => ({
    id: p.id,
    asin: p.asin,
    title: p.title,
    brand: p.brand,
    primaryImage: p.images?.[0] || { url: 'https://via.placeholder.com/400', thumbnailUrl: 'https://via.placeholder.com/100', altText: p.title, isPrimary: true, order: 0 },
    pricing: {
      currentPrice: p.pricing?.salePrice || p.pricing?.basePrice || 0,
      originalPrice: p.pricing?.compareAtPrice,
      savingsPercentage: p.pricing?.savingsPercentage,
    },
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    isPrimeEligible: p.isPrimeEligible || false,
    isBestSeller: p.isBestSeller || false,
    isAmazonChoice: p.isAmazonChoice || false,
    badges: p.badges || [],
    availability: p.availability || 'IN_STOCK',
    deliveryInfo: { fastestDays: 3, freeShipping: p.shipping?.freeShipping || false },
    category: p.category,
    subCategory: p.subCategory,
  }));

  const categoryDisplay = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : '';

  return (
    <div className="max-w-amazon mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {categoryDisplay || keyword ? `Results for "${keyword}"` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} products found</p>
      </div>

      {filteredProducts.length > 0 ? (
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