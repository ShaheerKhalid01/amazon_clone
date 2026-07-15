import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/ui/Button/Button';
import Rating from '@components/ui/Rating/Rating';
import { formatPrice } from '@utils/formatPrice';
import { FaShoppingCart, FaTrash, FaShare, FaHeartBroken } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface WishlistItem {
  productId: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  addedAt: string;
}

// ── Helper: localStorage se wishlist read karta hai ──────────────────────
const readWishlist = (): WishlistItem[] => {
  return JSON.parse(localStorage.getItem('wishlistItems') || '[]');
};

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    setWishlistItems(readWishlist());
  }, []);

  const sortedItems = [...wishlistItems].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(); // date (newest first)
  });

  // ── Add to Cart (real, uses the same 'cartItems' key as the rest of the app) ──
  const handleAddToCart = (item: WishlistItem) => {
    setIsAddingToCart(item.productId);
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const existing = cartItems.find((c: any) => c.productId === item.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cartItems.push({
          productId: item.productId,
          title: item.title,
          brand: item.brand,
          image: item.image,
          price: item.price,
          quantity: 1,
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      const totalItems = cartItems.reduce((sum: number, i: any) => sum + i.quantity, 0);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemCount: totalItems } }));
      toast.success('Added to cart!');
    } finally {
      setTimeout(() => setIsAddingToCart(null), 300);
    }
  };

  // ── Remove from wishlist (real, updates localStorage) ────────────────────
  const handleRemove = (productId: string) => {
    const updated = wishlistItems.filter(i => i.productId !== productId);
    setWishlistItems(updated);
    localStorage.setItem('wishlistItems', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { itemCount: updated.length } }));
    toast.success('Removed from wishlist');
  };

  const handleShare = (item: WishlistItem) => {
    const url = `${window.location.origin}/product/${item.productId}`;
    if (navigator.share) {
      navigator.share({ title: item.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-gray-500 mt-1">{wishlistItems.length} items saved</p>
        </div>
        {wishlistItems.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
          >
            <option value="date">Date Added</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        )}
      </div>

      {/* Wishlist Items */}
      {sortedItems.length > 0 ? (
        <div className="space-y-4">
          {sortedItems.map((item) => (
            <div key={item.productId} className="card-amazon p-4 md:p-6">
              <div className="flex gap-4">
                <Link
                  to={`/product/${item.productId}`}
                  className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/200'}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between flex-wrap gap-2">
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-sm md:text-base font-medium text-gray-900 hover:text-amazon-blue line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                      {item.rating !== undefined && (
                        <div className="mt-2">
                          <Rating rating={item.rating} count={item.reviewCount} size="sm" />
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      loading={isAddingToCart === item.productId}
                    >
                      <FaShoppingCart className="mr-1" />
                      Add to Cart
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => handleRemove(item.productId)}>
                      <FaTrash className="mr-1" />
                      Remove
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => handleShare(item)}>
                      <FaShare className="mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FaHeartBroken className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist and find them quickly later.</p>
          <Link to="/products">
            <Button variant="primary">Discover Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;