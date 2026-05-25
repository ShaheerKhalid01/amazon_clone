import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@components/ui/Badge/Badge';
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

  // ✅ Simple localStorage cart
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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <Link to={`/product/${product.id}`} className="card-amazon group overflow-hidden">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img src={product.primaryImage?.url || 'https://via.placeholder.com/400'} alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestSeller && <Badge variant="best-seller">Best Seller</Badge>}
          {product.isAmazonChoice && <Badge variant="amazon-choice">Amazon's Choice</Badge>}
        </div>
        <button onClick={handleWishlist} className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100">
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
        </button>
        <button onClick={handleAddToCart} disabled={isAddingToCart}
          className="absolute bottom-2 right-2 p-3 bg-amazon-orange text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100">
          <FaShoppingCart />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amazon-blue">{product.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
        <div className="mt-2"><Rating rating={product.rating || 0} count={product.reviewCount} size="sm" showValue={false} /></div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(currentPrice)}</span>
          {originalPrice && <span className="text-xs text-gray-500 line-through">{formatPrice(originalPrice)}</span>}
        </div>
        {product.isPrimeEligible && <div className="mt-2"><Badge variant="prime">Prime</Badge></div>}
      </div>
    </Link>
  );
};

export default ProductCard;