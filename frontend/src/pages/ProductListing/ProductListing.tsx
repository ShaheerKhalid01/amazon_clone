import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@components/product/ProductGrid/ProductGrid';
import FilterPanel from '@components/search/FilterPanel/FilterPanel';
import SortDropdown from '@components/search/SortDropdown/SortDropdown';
import Pagination from '@components/ui/Pagination/Pagination';
import Button from '@components/ui/Button/Button';
import { FaFilter, FaTh, FaList } from 'react-icons/fa';
import { mockProducts } from '@services/mockData';

const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get URL params
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'relevance';
  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('q') || '';

  // ✅ FILTER PRODUCTS BY CATEGORY
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Filter by category
    if (category) {
      result = result.filter(p =>
        p.category.toLowerCase() === category.toUpperCase() ||
        p.category.toLowerCase().includes(category.toLowerCase()) ||
        p.subCategory?.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by keyword (search)
    if (keyword) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(keyword.toLowerCase()) ||
        p.brand.toLowerCase().includes(keyword.toLowerCase()) ||
        p.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => (a.pricing?.salePrice || a.pricing?.basePrice || 0) - (b.pricing?.salePrice || b.pricing?.basePrice || 0));
    if (sortBy === 'price-desc') result.sort((a, b) => (b.pricing?.salePrice || b.pricing?.basePrice || 0) - (a.pricing?.salePrice || a.pricing?.basePrice || 0));
    if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [category, keyword, sortBy]);

  // Pagination
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Format products for ProductCard
  const formattedProducts = paginatedProducts.map(p => ({
    id: p.id,
    asin: p.asin,
    title: p.title,
    brand: p.brand,
    primaryImage: p.images?.[0] || { url: 'https://via.placeholder.com/400', thumbnailUrl: 'https://via.placeholder.com/100', altText: p.title, isPrimary: true, order: 0 },
    pricing: {
      currentPrice: p.pricing?.salePrice || p.pricing?.basePrice || 0,
      originalPrice: p.pricing?.compareAtPrice,
      savings: p.pricing?.savingsPercentage,
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

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => { prev.set('page', newPage.toString()); return prev; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort: string) => {
    setSearchParams(prev => { prev.set('sort', sort); prev.set('page', '1'); return prev; });
  };

  const categoryDisplay = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : '';

  return (
    <div className="max-w-amazon mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {categoryDisplay ? categoryDisplay : keyword ? `Results for "${keyword}"` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {filteredProducts.length} products found
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel filters={{}} onChange={() => { }} category={category} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="card-amazon p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <FaFilter className="mr-2" /> Filters
                </Button>
                <div className="hidden sm:flex border rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-amazon-orange text-white' : 'bg-white text-gray-600'}`}><FaTh /></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-amazon-orange text-white' : 'bg-white text-gray-600'}`}><FaList /></button>
                </div>
              </div>
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>
            {showFilters && (
              <div className="mt-4 lg:hidden">
                <FilterPanel filters={{}} onChange={() => { }} category={category} />
              </div>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid products={formattedProducts} loading={false} variant={viewMode} columns={4} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try a different category or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;