import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import Button from '@components/ui/Button/Button';
import Spinner from '@components/ui/Spinner/Spinner';
import Rating from '@components/ui/Rating/Rating';
import { formatPrice } from '@utils/formatPrice';
import { 
  FaHeart, FaShoppingCart, FaTrash, FaShare, 
  FaHeartBroken, FaSort, FaFilter 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Wishlist Page Component
 */
const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState('date');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  // Mock wishlist data
  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ['wishlist', { sortBy, filterPriority }],
    queryFn: async () => {
      return [
        {
          id: '1',
          productId: 'prod-1',
          title: 'Wireless Bluetooth Headphones',
          brand: 'AudioTech',
          image: '/placeholder.png',
          rating: 4.5,
          reviewCount: 1234,
          currentPrice: 99.99,
          originalPrice: 149.99,
          isOnSale: true,
          isPrimeEligible: true,
          availability: 'IN_STOCK',
          addedAt: '2024-01-15',
          priority: 'HIGH',
          notes: 'Birthday gift for mom',
          quantity: 1,
        },
        {
          id: '2',
          productId: 'prod-2',
          title: 'Yoga Mat Premium',
          brand: 'FitLife',
          image: '/placeholder.png',
          rating: 4.8,
          reviewCount: 856,
          currentPrice: 49.99,
          isOnSale: false,
          isPrimeEligible: true,
          availability: 'IN_STOCK',
          addedAt: '2024-01-10',
          priority: 'MEDIUM',
          quantity: 2,
        },
        {
          id: '3',
          productId: 'prod-3',
          title: 'Gaming Laptop Stand',
          brand: 'TechPro',
          image: '/placeholder.png',
          rating: 4.3,
          reviewCount: 432,
          currentPrice: 79.99,
          originalPrice: 99.99,
          isOnSale: true,
          isPrimeEligible: false,
          availability: 'IN_STOCK',
          addedAt: '2024-01-05',
          priority: 'LOW',
          quantity: 1,
        },
      ];
    },
  });

  // Handle add to cart
  const handleAddToCart = async (productId: string) => {
    try {
      setIsAddingToCart(productId);
      await dispatch(addToCart({ productId, quantity: 1 }) as any);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(null);
    }
  };

  // Handle remove from wishlist
  const handleRemove = async (productId: string) => {
    try {
      await dispatch(removeFromWishlist(productId) as any);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  // Handle share
  const handleShare = (item: any) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        url: `${window.location.origin}/product/${item.productId}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/product/${item.productId}`
      );
      toast.success('Link copied!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center min-h-screen py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Wishlist
          </h1>
          <p className="text-gray-500 mt-1">
            {wishlistItems?.length || 0} items saved
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
          >
            <option value="date">Date Added</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="priority">Priority</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems && wishlistItems.length > 0 ? (
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="card-amazon p-4 md:p-6">
              <div className="flex gap-4">
                {/* Product Image */}
                <Link
                  to={`/product/${item.productId}`}
                  className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-sm md:text-base font-medium text-gray-900 hover:text-amazon-blue line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                      
                      {/* Rating */}
                      <div className="mt-2">
                        <Rating rating={item.rating} count={item.reviewCount} size="sm" />
                      </div>

                      {/* Priority Badge */}
                      <div className="mt-2">
                        <span className={`
                          inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${item.priority === 'HIGH' 
                            ? 'bg-red-100 text-red-700' 
                            : item.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {item.priority} Priority
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.currentPrice)}
                      </p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </p>
                      )}
                      {item.isOnSale && (
                        <span className="text-xs text-green-600 font-medium">
                          On Sale
                        </span>
                      )}
                      {item.isPrimeEligible && (
                        <span className="block mt-1 text-xs text-amazon-blue font-medium">
                          Prime Eligible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      📝 {item.notes}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToCart(item.productId)}
                      loading={isAddingToCart === item.productId}
                      disabled={item.availability === 'OUT_OF_STOCK'}
                    >
                      <FaShoppingCart className="mr-1" />
                      Add to Cart
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(item.productId)}
                    >
                      <FaTrash className="mr-1" />
                      Remove
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(item)}
                    >
                      <FaShare className="mr-1" />
                      Share
                    </Button>

                    {/* Quantity */}
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm text-gray-500">Qty:</span>
                      <select
                        value={item.quantity}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Availability */}
                  <p className={`mt-2 text-xs ${item.availability === 'IN_STOCK' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.availability === 'IN_STOCK' ? '✓ In Stock' : '× Out of Stock'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <FaHeartBroken className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Save items you love to your wishlist and find them quickly later.
          </p>
          <Link to="/products">
            <Button variant="primary">Discover Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
