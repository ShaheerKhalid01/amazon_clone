import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/product.service';
import ProductGrid from '@components/product/ProductGrid/ProductGrid';
import FilterPanel from '@components/search/FilterPanel/FilterPanel';
import SortDropdown from '@components/search/SortDropdown/SortDropdown';
import Pagination from '@components/ui/Pagination/Pagination';
import Button from '@components/ui/Button/Button';
import { FaFilter, FaTh, FaList } from 'react-icons/fa';

/**
 * Product Listing Page
 * Displays products with filtering, sorting, and pagination
 */
const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<any>({});

  // Get URL params
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'relevance';
  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('q') || '';

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, sortBy, category, keyword, ...filters }],
    queryFn: () =>
      productService.getProducts({
        page,
        limit: 20,
        sortBy,
        category,
        keyword,
        ...filters,
      }),
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSearchParams((prev) => {
      prev.set('sort', sort);
      prev.set('page', '1');
      return prev;
    });
  };

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setSearchParams((prev) => {
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <div className="max-w-amazon mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {category
            ? `${category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}`
            : keyword
            ? `Results for "${keyword}"`
            : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {pagination?.totalItems || 0} products found
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            category={category}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="card-amazon p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <FaFilter className="mr-2" />
                  Filters
                </Button>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-amazon-orange text-white' : 'bg-white text-gray-600'}`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-amazon-orange text-white' : 'bg-white text-gray-600'}`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>

              {/* Sort */}
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>

            {/* Mobile Filters (Expandable) */}
            {showFilters && (
              <div className="mt-4 lg:hidden">
                <FilterPanel
                  filters={filters}
                  onChange={handleFilterChange}
                  category={category}
                />
              </div>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={isLoading}
            variant={viewMode}
            columns={4}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
