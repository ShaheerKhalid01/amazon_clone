import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '@store/slices/cartSlice';
import { addToWishlist } from '@store/slices/wishlistSlice';
import Badge from '@components/ui/Badge/Badge';
import Rating from '@components/ui/Rating/Rating';
import { formatPrice, calculateSavings } from '@utils/formatPrice';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
  variant?: 'grid' | 'list';
}

/**
 * Product Card Component
 * Displays product information in grid or list view
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const {
    id,
    title,
    brand,
    pricing,
    primaryImage,
    rating = 0,
    reviewCount = 0,
    isPrimeEligible,
    isBestSeller,
    isAmazonChoice,
    availability,
    badges = [],
  } = product;

  const currentPrice = pricing?.currentPrice || product.basePrice || 0;
  const originalPrice = pricing?.originalPrice || product.compareAtPrice;
  const savings = originalPrice ? calculateSavings(originalPrice, currentPrice) : 0;

  /**
   * Handle add to cart
   */
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsAddingToCart(true);
      await dispatch(addToCart({ productId: id, quantity: 1 }) as any);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Handle wishlist toggle
   */
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      dispatch(addToWishlist({ productId: id }) as any);
      toast.success('Added to wishlist!');
    } else {
      toast.success('Removed from wishlist');
    }
  };

  // List variant
  if (variant === 'list') {
    return (
      <Link to={`/product/${id}`} className="card-amazon p-4 flex gap-6 hover:shadow-lg transition-all group">
        {/* Image */}
        <div className="w-48 h-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={primaryImage?.url || '/placeholder.png'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-amazon-blue transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{brand}</p>

          {/* Rating */}
          <div className="mt-2">
            <Rating rating={rating} count={reviewCount} size="sm" />
          </div>

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(currentPrice)}
            </span>
            {originalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {savings}% off
                </span>
              </>
            )}
          </div>

          {/* Features */}
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {product.description || 'No description available'}
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-amazon-orange hover:bg-amazon-orange-dark text-white px-6 py-2 rounded-full 
                       font-medium transition-colors disabled:opacity-50"
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlist}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-400 text-xl" />
              )}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link to={`/product/${id}`} className="card-amazon group overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={primaryImage?.url || '/placeholder.png'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isBestSeller && <Badge variant="best-seller">Best Seller</Badge>}
          {isAmazonChoice && <Badge variant="amazon-choice">Amazon's Choice</Badge>}
          {savings > 0 && <Badge variant="sale">{savings}% OFF</Badge>}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md 
                   hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-400" />
          )}
        </button>

        {/* Quick Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="absolute bottom-2 right-2 p-3 bg-amazon-orange text-white rounded-full 
                   shadow-lg hover:bg-amazon-orange-dark transition-all opacity-0 group-hover:opacity-100
                   disabled:opacity-50"
        >
          <FaShoppingCart />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amazon-blue transition-colors">
          {title}
        </h3>
        
        <p className="text-xs text-gray-500 mt-1">{brand}</p>

        {/* Rating */}
        <div className="mt-2">
          <Rating rating={rating} count={reviewCount} size="sm" showValue={false} />
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(currentPrice)}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Prime Badge */}
        {isPrimeEligible && (
          <div className="mt-2">
            <Badge variant="prime">Prime</Badge>
          </div>
        )}

        {/* Delivery Info */}
        <p className="mt-2 text-xs text-gray-500">
          {product.deliveryInfo?.freeShipping 
            ? '✓ FREE Shipping' 
            : `Ships in ${product.deliveryInfo?.fastestDays || 3} days`}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
