import React from 'react';
import ProductCard from '@components/product/ProductCard/ProductCard';
import Spinner from '@components/ui/Spinner/Spinner';

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  variant?: 'grid' | 'list';
  columns?: 2 | 3 | 4 | 5;
}

/**
 * Product Grid Component
 * Displays products in a responsive grid layout
 */
const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  variant = 'grid',
  columns = 4,
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="grid" />
      ))}
    </div>
  );
};

export default ProductGrid;
