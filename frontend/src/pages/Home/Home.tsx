import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/product.service';
import ProductCard from '@components/product/ProductCard/ProductCard';
import Spinner from '@components/ui/Spinner/Spinner';
import Button from '@components/ui/Button/Button';

/**
 * Home Page Component
 * Main landing page with hero, deals, categories, and recommendations
 */
const Home: React.FC = () => {
  const navigate = useNavigate();

  // Fetch featured products
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeaturedProducts(8),
  });

  // Fetch deals
  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => productService.getDeals(8),
  });

  // Featured categories
  const categories = [
    { name: 'Electronics', icon: '🖥️', slug: 'electronics', color: 'from-blue-500 to-blue-700' },
    { name: 'Fashion', icon: '👗', slug: 'fashion', color: 'from-pink-500 to-purple-600' },
    { name: 'Home & Kitchen', icon: '🏠', slug: 'home-kitchen', color: 'from-orange-500 to-red-600' },
    { name: 'Books', icon: '📚', slug: 'books', color: 'from-green-500 to-teal-600' },
    { name: 'Sports', icon: '⚽', slug: 'sports', color: 'from-yellow-500 to-orange-600' },
    { name: 'Beauty', icon: '💄', slug: 'beauty', color: 'from-pink-400 to-rose-600' },
    { name: 'Toys', icon: '🧸', slug: 'toys', color: 'from-purple-500 to-indigo-600' },
    { name: 'Automotive', icon: '🚗', slug: 'automotive', color: 'from-gray-600 to-gray-800' },
  ];

  // Quick links
  const quickLinks = [
    { title: 'Best Sellers', link: '/products?sort=rating' },
    { title: 'New Releases', link: '/products?sort=newest' },
    { title: "Today's Deals", link: '/deals' },
    { title: 'Prime Eligible', link: '/products?prime=true' },
  ];

  return (
    <div>
      {/* Hero Banner */}
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
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/deals')}
                className="border-white text-white hover:bg-white hover:text-amazon-navy"
              >
                View Deals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-amazon-dark-gray text-white py-4">
        <div className="max-w-amazon mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                to={link.link}
                className="px-4 py-2 rounded-full border border-gray-500 hover:border-white hover:bg-white hover:text-amazon-navy transition-all text-sm"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-amazon mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <Link to="/products" className="text-amazon-blue hover:underline text-sm">
            See all categories →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white 
                         transform hover:scale-105 transition-all duration-300 
                         shadow-lg hover:shadow-xl cursor-pointer group`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-white text-opacity-80 text-sm">Shop now →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Deals */}
      <section className="bg-amazon-light-gray py-12">
        <div className="max-w-amazon mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                🔥 Today's Deals
              </h2>
              <p className="text-gray-600 mt-2">Limited time offers on popular products</p>
            </div>
            <Link to="/deals" className="text-amazon-blue hover:underline text-sm">
              See all deals →
            </Link>
          </div>

          {dealsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {deals?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-amazon mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 mt-2">Top picks for you</p>
          </div>
          <Link to="/products?sort=rating" className="text-amazon-blue hover:underline text-sm">
            See more →
          </Link>
        </div>

        {featuredLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Prime Banner */}
      <section className="bg-amazon-blue text-white py-12">
        <div className="max-w-amazon mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🚀 Amazon Prime
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get free shipping, exclusive deals, and premium entertainment
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/prime')}
          >
            Try Prime Free
          </Button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-amazon-navy text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-6">
            Subscribe to our newsletter for the latest deals and new arrivals.
          </p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
