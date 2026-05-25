import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@components/product/ProductCard/ProductCard';
import { mockProducts } from '@services/mockData';

const Deals: React.FC = () => {
  const dealsProducts = useMemo(() => {
    return mockProducts.filter(p => p.pricing?.isOnSale || p.pricing?.salePrice);
  }, []);

  const getCurrentSlot = () => {
    const now = new Date();
    const hours = now.getHours();
    const slotSize = 4;
    const totalSlots = Math.ceil(dealsProducts.length / slotSize);
    return Math.floor(hours / 6) % totalSlots;
  };

  const [currentSlot, setCurrentSlot] = useState(getCurrentSlot());

  const getTimeLeft = () => {
    const now = new Date();
    const nextSlotHour = (Math.floor(now.getHours() / 6) + 1) * 6;
    const nextSlot = new Date(now);
    nextSlot.setHours(nextSlotHour, 0, 0, 0);
    return Math.max(0, nextSlot.getTime() - now.getTime());
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeLeft();
      setTimeLeft(remaining > 0 ? remaining : 0);
      const newSlot = getCurrentSlot();
      if (newSlot !== currentSlot) setCurrentSlot(newSlot);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentSlot]);

  const currentDeals = useMemo(() => {
    const start = currentSlot * 4;
    return dealsProducts.slice(start, start + 4);
  }, [dealsProducts, currentSlot]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return { hours: '00', minutes: '00', seconds: '00' };
    const totalSeconds = Math.floor(ms / 1000);
    return {
      hours: String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
      minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
      seconds: String(totalSeconds % 60).padStart(2, '0'),
    };
  };

  const time = formatTime(timeLeft);

  const formattedDeals = currentDeals.map(p => ({
    id: p.id,
    asin: p.asin,
    title: p.title,
    brand: p.brand,
    primaryImage: p.images?.[0] || { url: 'https://via.placeholder.com/400', thumbnailUrl: 'https://via.placeholder.com/100', altText: p.title, isPrimary: true, order: 0 },
    pricing: {
      currentPrice: p.pricing?.salePrice || p.pricing?.basePrice || 0,
      originalPrice: p.pricing?.compareAtPrice,
      savings: p.pricing?.savingsPercentage,
      savingsPercentage: p.pricing?.savingsPercentage,
    },
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    isPrimeEligible: p.isPrimeEligible || false,
    isBestSeller: p.isBestSeller || false,
    isAmazonChoice: p.isAmazonChoice || false,
    badges: p.badges || [],
    availability: p.availability || 'IN_STOCK',
    deliveryInfo: { fastestDays: 3, freeShipping: p.shipping?.freeShipping || false },
    category: p.category,
    subCategory: p.subCategory,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔥 Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
        <div className="max-w-amazon mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left - Title */}
            <div className="flex items-center gap-4">
              <span className="text-6xl animate-bounce">🔥</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Today's Deals</h1>
                <p className="text-red-100 text-lg mt-1">New deals every 6 hours • Limited stock</p>
                <div className="flex gap-3 mt-3">
                  <span className="bg-white/20 backdrop-blur text-sm px-3 py-1 rounded-full">Slot {currentSlot + 1}</span>
                  <span className="bg-white/20 backdrop-blur text-sm px-3 py-1 rounded-full">{currentDeals.length} deals</span>
                </div>
              </div>
            </div>

            {/* Right - Timer */}
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-5 flex items-center gap-4 shadow-2xl border border-white/10">
              <span className="text-sm font-medium uppercase tracking-wider">Ends in</span>
              <div className="flex items-center gap-2">
                <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[60px]">
                  <span className="text-3xl font-bold tabular-nums block">{time.hours}</span>
                  <span className="text-[10px] uppercase tracking-wider">Hrs</span>
                </div>
                <span className="text-2xl font-light">:</span>
                <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[60px]">
                  <span className="text-3xl font-bold tabular-nums block">{time.minutes}</span>
                  <span className="text-[10px] uppercase tracking-wider">Min</span>
                </div>
                <span className="text-2xl font-light">:</span>
                <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[60px]">
                  <span className="text-3xl font-bold tabular-nums block">{time.seconds}</span>
                  <span className="text-[10px] uppercase tracking-wider">Sec</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ SPACER - No overlap */}
      <div className="h-6 bg-gray-50"></div>

      {/* 📦 Products Section */}
      <div className="max-w-amazon mx-auto px-4 pb-12">
        {formattedDeals.length > 0 ? (
          <>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                🎯 Flash Deals <span className="text-red-500 text-sm font-normal ml-2">({currentDeals.length} products)</span>
              </h2>
              <Link to="/products" className="text-amazon-blue hover:underline text-sm font-medium">
                View All Products →
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {formattedDeals.map(product => (
                <div key={product.id} className="relative group">
                  {/* ✅ Single DEAL badge - card ke andar ProductCard handle karega */}
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <span className="text-7xl">🛍️</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">No Deals Right Now</h2>
            <p className="text-gray-500 mt-2">Next deals drop soon! Check back later.</p>
            <Link to="/products" className="inline-block mt-6 bg-amazon-orange text-white px-6 py-3 rounded-full font-medium hover:bg-amazon-orange-dark transition">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deals;