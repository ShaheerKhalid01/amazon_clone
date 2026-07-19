import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '@components/product/ProductCard/ProductCard';
import Button from '@components/ui/Button/Button';
import { mockCategories } from '@services/mockData';
import { FaSpinner } from 'react-icons/fa';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    return currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')
      ? 'http://localhost:5000/api'
      : `${currentOrigin}/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBaseUrl();

// ── Helper: MongoDB product ko ProductCard ke expected shape mein convert karta hai ──
const mapToCardShape = (product: any) => {
  const currentPrice = product.salePrice || product.basePrice || 0;
  const savingsPercentage = product.salePrice && product.basePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;

  return {
    id: product._id,
    asin: product._id,
    title: product.title,
    brand: product.brand,
    primaryImage: { url: product.image, altText: product.title },
    pricing: {
      currentPrice,
      originalPrice: product.salePrice ? product.basePrice : undefined,
      savings: savingsPercentage,
      savingsPercentage,
    },
    rating: product.rating || 0,
    reviewCount: product.totalReviews || 0,
    isPrimeEligible: true,
    isBestSeller: product.isBestSeller,
    isAmazonChoice: false,
    badges: [],
    availability: 'IN_STOCK',
    deliveryInfo: { fastestDays: 3, freeShipping: true },
    category: 'ELECTRONICS',
    subCategory: '',
  };
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Real products fetch karein MongoDB se ──────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          setAllProducts(json.data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deals = allProducts.filter(p => p.salePrice && p.salePrice < p.basePrice).slice(0, 8);
  const featuredProducts = allProducts.filter(p => p.isBestSeller).slice(0, 8);
  const categories = mockCategories;

  const quickLinks = [
    { title: 'Best Sellers', link: '/products?sort=bestseller' },
    { title: 'New Releases', link: '/products?sort=newest' },
    { title: "Today's Deals", link: '/deals' },
    { title: 'Prime Eligible', link: '/products?prime=true' },
  ];

  return (
    <div>
      {/* ========== HERO BANNER ========== */}
      <section className="relative bg-gradient-to-br from-amazon-navy via-amazon-dark-gray to-amazon-navy text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-amazon mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing Products at <span className="text-amazon-orange">Unbeatable</span> Prices
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Shop millions of products with fast delivery, easy returns, and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" onClick={() => navigate('/products')}>Shop Now</Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/deals')} className="border-white text-white hover:bg-white hover:text-amazon-navy">View Deals</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== QUICK LINKS ========== */}
      <section className="bg-amazon-dark-gray text-white py-4">
        <div className="max-w-amazon mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {quickLinks.map((link) => (
              <Link key={link.title} to={link.link}
                className="px-4 py-2 rounded-full border border-gray-500 hover:border-white hover:bg-white hover:text-amazon-navy transition-all text-sm">
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES GRID ========== */}
      <section className="max-w-amazon mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/products" className="text-amazon-blue hover:underline text-sm">See all categories →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.slug} to={`/products?category=${category.slug}`}
              className="card-amazon p-6 text-center hover:shadow-lg transition-all group cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Loading state while fetching real products */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <FaSpinner className="animate-spin mr-2" size={24} /> Loading products...
        </div>
      ) : (
        <>
          {/* ========== TODAY'S DEALS ========== */}
          {deals.length > 0 && (
            <section className="bg-red-50 py-12">
              <div className="max-w-amazon mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">🔥 Today's Deals</h2>
                    <p className="text-gray-600 mt-2">Limited time offers on popular products</p>
                  </div>
                  <Link to="/deals" className="text-amazon-blue hover:underline text-sm">See all deals →</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {deals.map((product: any) => (
                    <ProductCard key={product._id} product={mapToCardShape(product)} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ========== FEATURED PRODUCTS ========== */}
          {featuredProducts.length > 0 && (
            <section className="max-w-amazon mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
                  <p className="text-gray-600 mt-2">Top picks for you</p>
                </div>
                <Link to="/products?sort=bestseller" className="text-amazon-blue hover:underline text-sm">See more →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product: any) => (
                  <ProductCard key={product._id} product={mapToCardShape(product)} />
                ))}
              </div>
            </section>
          )}

          {allProducts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}
        </>
      )}

      {/* ========== PRIME BANNER ========== */}
      <section className="bg-amazon-blue text-white py-12">
        <div className="max-w-amazon mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">🚀 Amazon Prime</h2>
          <p className="text-xl mb-8 text-blue-100">Get free shipping, exclusive deals, and premium entertainment</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/prime')}>Try Prime Free</Button>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section className="bg-amazon-navy text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-6">Subscribe to our newsletter for the latest deals and new arrivals.</p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-full text-white bg-amazon-dark-gray border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            />
            <Button type="submit" variant="primary">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;