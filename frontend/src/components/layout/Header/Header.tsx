import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { setSearchQuery, toggleMobileMenu, toggleSearch } from '@store/slices/uiSlice';
import { useAuth } from '@hooks/useAuth';
import { useCart } from '@hooks/useCart';
import { useDebounce } from '@hooks/useDebounce';

/**
 * Header Component
 * Main navigation header with search, cart, and user menu
 */
const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { searchQuery, searchOpen } = useSelector((state: RootState) => state.ui);
  
  const [localSearch, setLocalSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Handle search
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
      dispatch(toggleSearch());
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-amazon-navy text-white sticky top-0 z-50">
      {/* Main Header */}
      <div className="flex items-center px-4 py-2 gap-4 max-w-amazon mx-auto">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 py-2 px-2 hover:border hover:border-white rounded-sm">
          <span className="text-2xl font-bold text-white">amazon</span>
          <span className="text-xs text-amazon-orange block -mt-1">clone</span>
        </Link>

        {/* Delivery Location */}
        <button className="hidden lg:flex items-center px-2 py-2 hover:border hover:border-white rounded-sm">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="text-left">
            <div className="text-xs text-gray-300">Deliver to</div>
            <div className="text-sm font-bold">Select Location</div>
          </div>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 flex">
          <div className="flex flex-1">
            <input
              ref={searchInputRef}
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search Amazon..."
              className="w-full px-4 py-2 text-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            />
            <button
              type="submit"
              className="bg-amazon-orange hover:bg-amazon-orange-dark px-6 rounded-r-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Language */}
        <button className="hidden lg:flex items-center px-2 py-2 hover:border hover:border-white rounded-sm">
          <span className="text-sm font-bold">EN</span>
        </button>

        {/* Account */}
        <div className="relative user-menu">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="hidden lg:flex flex-col px-2 py-2 hover:border hover:border-white rounded-sm"
          >
            <span className="text-xs">
              {isAuthenticated ? `Hello, ${user?.firstName}` : 'Hello, Sign in'}
            </span>
            <span className="text-sm font-bold">Account & Lists</span>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl border animate-fade-in">
              {isAuthenticated ? (
                <div className="p-4">
                  <Link
                    to="/account"
                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Your Account
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Your Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Your Wishlist
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      useAuth().logout();
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <Link
                    to="/login"
                    className="block w-full text-center bg-amazon-yellow hover:bg-amazon-yellow-dark 
                             text-gray-900 font-medium py-2 rounded-full mb-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Sign In
                  </Link>
                  <p className="text-sm text-center">
                    New customer?{' '}
                    <Link
                      to="/register"
                      className="text-amazon-blue hover:underline"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Start here.
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link
          to="/orders"
          className="hidden lg:flex flex-col px-2 py-2 hover:border hover:border-white rounded-sm"
        >
          <span className="text-xs">Returns</span>
          <span className="text-sm font-bold">& Orders</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="flex items-center px-2 py-2 hover:border hover:border-white rounded-sm relative"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span className="text-sm font-bold mt-3">Cart</span>
          {itemCount > 0 && (
            <span className="absolute top-0 left-6 bg-amazon-orange text-white text-xs 
                           font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Sub Navigation */}
      <div className="bg-amazon-dark-gray text-white">
        <div className="flex items-center px-4 py-1 gap-4 max-w-amazon mx-auto text-sm">
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="flex items-center gap-1 px-2 py-1 hover:border hover:border-white rounded-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            All
          </button>
          
          <Link to="/deals" className="px-2 py-1 hover:border hover:border-white rounded-sm">
            Today's Deals
          </Link>
          <Link to="/products?category=ELECTRONICS" className="px-2 py-1 hover:border hover:border-white rounded-sm">
            Electronics
          </Link>
          <Link to="/products?category=FASHION" className="px-2 py-1 hover:border hover:border-white rounded-sm">
            Fashion
          </Link>
          <Link to="/products?category=BOOKS" className="px-2 py-1 hover:border hover:border-white rounded-sm">
            Books
          </Link>
          <Link to="/products?category=HOME_KITCHEN" className="px-2 py-1 hover:border hover:border-white rounded-sm">
            Home & Kitchen
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
