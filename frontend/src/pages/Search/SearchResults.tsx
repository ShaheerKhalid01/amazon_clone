import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/product.service';
import SearchBar from '@components/search/SearchBar/SearchBar';
import FilterPanel from '@components/search/FilterPanel/FilterPanel';
import SortDropdown from '@components/search/SortDropdown/SortDropdown';
import ProductGrid from '@components/product/ProductGrid/ProductGrid';
import Pagination from '@components/ui/Pagination/Pagination';
import Button from '@components/ui/Button/Button';
import Spinner from '@components/ui/Spinner/Spinner';
import { FaFilter } from 'react-icons/fa';

/**
 * Search Results Page
 */
const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'relevance';
  const category = searchParams.get('category') || '';

  // Fetch search results
  const { data, isLoading } = useQuery({
    queryKey: ['search', { query, page, sortBy, category, ...filters }],
    queryFn: () =>
      productService.searchProducts(query, {
        page,
        limit: 20,
        sortBy,
        category,
        ...filters,
      }),
    enabled: !!query || !!category,
  });

  const products = data?.products || [];
  const pagination = data?.pagination;
  const searchFilters = data?.filters;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSearchParams(prev => {
      prev.set('sort', sort);
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <div className="max-w-amazon mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar initialValue={query} variant="full" />
      </div>

      {/* Results Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          {query ? `Results for "${query}"` : category ? `${category} Products` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {pagination?.totalItems || 0} results found
        </p>
      </div>

      {/* Related Searches */}
      {data?.relatedSearches && data.relatedSearches.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Related searches:</h3>
          <div className="flex flex-wrap gap-2">
            {data.relatedSearches.map((term: string, index: number) => (
              <button
                key={index}
                onClick={() => setSearchParams({ q: term })}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            category={category}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="card-amazon p-4 mb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <FaFilter className="mr-2" />
                Filters
              </Button>
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mt-4 lg:hidden">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  category={category}
                />
              </div>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">
                Try checking your spelling or use more general terms
              </p>
              {query && (
                <button
                  onClick={() => setSearchParams({})}
                  className="text-amazon-blue hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
