import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/product.service';
import Rating from '@components/ui/Rating/Rating';
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';

interface FilterPanelProps {
  filters: any;
  onChange: (filters: any) => void;
  category?: string;
}

/**
 * Filter Panel Component
 * Sidebar filters for product listing
 */
const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, category }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    rating: true,
    brand: true,
    availability: true,
  });

  // Fetch filter options
  const { data: filterOptions } = useQuery({
    queryKey: ['search-filters', { category }],
    queryFn: () => productService.getProducts({ category }),
    enabled: true,
  }) as any;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (key: string, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    const priceRange = { ...filters.priceRange };
    
    if (type === 'min') priceRange.min = numValue;
    if (type === 'max') priceRange.max = numValue;
    
    onChange({
      ...filters,
      priceRange,
    });
  };

  const clearAllFilters = () => {
    onChange({});
  };

  // Filter sections
  const sections = [
    {
      id: 'category',
      title: 'Department',
      content: (
        <div className="space-y-2">
          {['Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Sports'].map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === cat}
                onChange={() => handleFilterChange('category', filters.category === cat ? undefined : cat)}
                className="w-4 h-4 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
              />
              <span className="text-sm text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'price',
      title: 'Price Range',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            />
          </div>
          <button className="text-sm text-amazon-blue hover:underline">Go</button>
        </div>
      ),
    },
    {
      id: 'rating',
      title: 'Customer Reviews',
      content: (
        <div className="space-y-2">
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === stars}
                onChange={() => handleFilterChange('rating', filters.rating === stars ? undefined : stars)}
                className="w-4 h-4 text-amazon-orange focus:ring-amazon-orange"
              />
              <span className="flex items-center gap-1 text-sm">
                <Rating rating={stars} size="sm" showValue={false} />
                <span className="text-gray-700">& Up</span>
              </span>
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'availability',
      title: 'Availability',
      content: (
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked || undefined)}
              className="w-4 h-4 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
            />
            <span className="text-sm text-gray-700">In Stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.primeEligible || false}
              onChange={(e) => handleFilterChange('primeEligible', e.target.checked || undefined)}
              className="w-4 h-4 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
            />
            <span className="text-sm text-gray-700">Prime Eligible</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSale || false}
              onChange={(e) => handleFilterChange('onSale', e.target.checked || undefined)}
              className="w-4 h-4 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
            />
            <span className="text-sm text-gray-700">On Sale</span>
          </label>
        </div>
      ),
    },
    {
      id: 'brand',
      title: 'Brand',
      content: (
        <div className="space-y-2">
          {filterOptions?.brands?.slice(0, 10).map((brand: any) => (
            <label key={brand.name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand.name)}
                onChange={(e) => {
                  const brands = filters.brands || [];
                  const newBrands = e.target.checked
                    ? [...brands, brand.name]
                    : brands.filter((b: string) => b !== brand.name);
                  handleFilterChange('brands', newBrands.length > 0 ? newBrands : undefined);
                }}
                className="w-4 h-4 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
              />
              <span className="text-sm text-gray-700">{brand.name}</span>
              <span className="text-xs text-gray-400 ml-auto">({brand.count})</span>
            </label>
          ))}
        </div>
      ),
    },
  ];

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-amazon-blue hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="p-4 border-b flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-2 py-1 bg-amazon-orange bg-opacity-10 
                       text-amazon-orange text-xs rounded-full"
            >
              {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
              <button
                onClick={() => handleFilterChange(key, undefined)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Filter Sections */}
      <div className="divide-y">
        {sections.map((section) => (
          <div key={section.id} className="p-4">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">{section.title}</span>
              {expandedSections[section.id] ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
            </button>
            
            {expandedSections[section.id] && (
              <div className="mt-3">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
