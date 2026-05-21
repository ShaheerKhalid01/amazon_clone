import React from 'react';
import type { ProductSpecifications } from '@/types/product.types';

interface ProductSpecsProps {
  specifications: ProductSpecifications;
}

/**
 * Product Specifications Component
 * Displays technical details and attributes of a product
 */
const ProductSpecs: React.FC<ProductSpecsProps> = ({ specifications }) => {
  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 mt-8 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Product Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {Object.entries(specifications).map(([category, data]) => (
          <div key={category} className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">
              {data.label}
            </h3>
            
            <dl className="space-y-3">
              {data.specifications.map((spec, index) => (
                <div key={index} className="flex text-sm">
                  <dt className="w-1/3 font-medium text-gray-500">{spec.name}</dt>
                  <dd className="w-2/3 text-gray-900">
                    {spec.value}
                    {spec.unit && <span className="ml-1 text-gray-500">{spec.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecs;
