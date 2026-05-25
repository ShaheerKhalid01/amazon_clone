import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@components/ui/Rating/Rating';
import { formatPrice } from '@utils/formatPrice';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const currentPrice = product.pricing?.currentPrice || product.pricing?.basePrice || 0;
  const originalPrice = product.pricing?.originalPrice || product.pricing?.compareAtPrice;
  const savings = product.pricing?.savingsPercentage || product.pricing?.savings || 0;

  // Add to Cart (localStorage)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);

    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existing = items.find((i: any) => i.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        productId: product.id,
        title: product.title,
        brand: product.brand,
        image: product.primaryImage?.url || '',
        price: currentPrice,
        quantity: 1,
      });
    }
    localStorage.setItem('cartItems', JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemCount: items.length } }));

    toast.success('Added to cart!');
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  // Wishlist Toggle
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  // ========== LIST VIEW ==========
  if (variant === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="card-amazon p-4 flex gap-6 hover:shadow-lg transition-all group">
        <div className="w-48 h-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <img src={product.primaryImage?.url || 'https://via.placeholder.com/400'} alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-amazon-blue transition-colors line-clamp-2">{product.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
          <div className="mt-2"><Rating rating={product.rating || 0} count={product.reviewCount} size="sm" /></div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
            {originalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">{formatPrice(originalPrice)}</span>
                {savings > 0 && <span className="text-sm text-green-600 font-medium">{savings}% off</span>}
              </>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleAddToCart} disabled={isAddingToCart}
              className="bg-amazon-orange hover:bg-amazon-orange-dark text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50">
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button onClick={handleWishlist} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              {isWishlisted ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-400 text-xl" />}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // ========== GRID VIEW (DEFAULT) ==========
  return (
    <Link to={`/product/${product.id}`} className="card-amazon group overflow-hidden h-full flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img src={product.primaryImage?.url || 'https://via.placeholder.com/400'} alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

        {/* ✅ BADGES - Stacked vertically with gap */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-amazon-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Best Seller
            </span>
          )}
          {product.isAmazonChoice && (
            <span className="bg-amazon-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Amazon's Choice
            </span>
          )}
          {savings > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              -{savings}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
        </button>

        {/* Quick Add to Cart */}
        <button onClick={handleAddToCart} disabled={isAddingToCart}
          className="absolute bottom-2 right-2 p-3 bg-amazon-orange text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 disabled:opacity-50">
          <FaShoppingCart />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amazon-blue transition-colors flex-1">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
        
        {/* Rating */}
        <div className="mt-1.5">
          <Rating rating={product.rating || 0} count={product.reviewCount} size="sm" showValue={false} />
        </div>

        {/* Price */}
        <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-lg font-bold text-gray-900">{formatPrice(currentPrice)}</span>
          {originalPrice && (
            <span className="text-xs text-gray-500 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>

        {/* Prime Badge */}
        {product.isPrimeEligible && (
          <div className="mt-1.5">
            <span className="bg-amazon-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Prime</span>
          </div>
        )}

        {/* Delivery */}
        <p className="mt-1.5 text-[11px] text-gray-500">
          {product.deliveryInfo?.freeShipping ? '✓ FREE Shipping' : `Ships in ${product.deliveryInfo?.fastestDays || 3} days`}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;