import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@utils/formatPrice';
import { FaTrash, FaGift, FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface CartItemProps {
  item: any;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isUpdating: boolean;
}

/**
 * Cart Item Component
 */
const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}) => {
  const {
    productId,
    title,
    brand,
    image,
    variant,
    quantity,
    unitPrice,
    totalPrice,
    compareAtPrice,
    savings,
    isGift,
    giftMessage,
    inStock,
    maxQuantity,
    isPrimeEligible,
    sellerName,
  } = item;

  return (
    <div className="p-4 md:p-6 flex gap-4">
      {/* Product Image */}
      <Link
        to={`/product/${productId}`}
        className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          src={image?.url || image || '/placeholder.png'}
          alt={title}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <Link
              to={`/product/${productId}`}
              className="text-sm md:text-base font-medium text-gray-900 hover:text-amazon-blue line-clamp-2"
            >
              {title}
            </Link>
            <p className="text-xs text-gray-500 mt-1">{brand}</p>
            
            {/* Variant Info */}
            {variant && variant.options && (
              <p className="text-xs text-gray-500 mt-1">
                {variant.options.map((opt: any) => `${opt.name}: ${opt.value}`).join(', ')}
              </p>
            )}

            {/* Stock Status */}
            <p className={`text-xs mt-1 ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? '✓ In Stock' : '× Out of Stock'}
            </p>

            {/* Gift Options */}
            {isGift && (
              <div className="flex items-center gap-1 mt-1 text-xs text-amazon-blue">
                <FaGift />
                <span>This is a gift</span>
                {giftMessage && <span className="text-gray-500">- {giftMessage}</span>}
              </div>
            )}

            {/* Prime Badge */}
            {isPrimeEligible && (
              <span className="inline-block mt-1 px-1.5 py-0.5 bg-amazon-blue text-white text-xs rounded">
                Prime
              </span>
            )}
          </div>

          {/* Price */}
          <div className="text-right ml-4">
            <p className="text-sm md:text-lg font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </p>
            {compareAtPrice && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(compareAtPrice * quantity)}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          {/* Quantity Selector */}
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => onUpdateQuantity(productId, quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <FaChevronDown size={12} />
            </button>
            <span className="px-4 py-1 text-sm font-medium min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(productId, quantity + 1)}
              disabled={quantity >= maxQuantity || isUpdating}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <FaChevronUp size={12} />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(productId)}
            disabled={isUpdating}
            className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        {/* Seller Info */}
        <p className="text-xs text-gray-400 mt-2">
          Sold by: {sellerName}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
