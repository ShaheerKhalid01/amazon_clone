import React from 'react';
import { formatPrice } from '@utils/formatPrice';

interface ProductPriceProps {
  currentPrice: number;
  originalPrice?: number;
  isOnSale?: boolean;
  savingsPercentage?: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Product Price Display Component
 */
const ProductPrice: React.FC<ProductPriceProps> = ({
  currentPrice,
  originalPrice,
  isOnSale,
  savingsPercentage,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { price: 'text-lg', original: 'text-xs' },
    md: { price: 'text-2xl', original: 'text-sm' },
    lg: { price: 'text-3xl', original: 'text-base' },
  };

  const savings = savingsPercentage || 
    (originalPrice && currentPrice 
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
      : 0);

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className={`${sizeClasses[size].price} font-bold text-gray-900`}>
          {formatPrice(currentPrice)}
        </span>
        {originalPrice && originalPrice > currentPrice && (
          <span className={`${sizeClasses[size].original} text-gray-500 line-through`}>
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {isOnSale && savings > 0 && (
        <div className="mt-1 flex items-center gap-2">
          <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
            -{savings}%
          </span>
          <span className="text-sm text-red-600">
            You save {formatPrice((originalPrice || currentPrice) - currentPrice)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
