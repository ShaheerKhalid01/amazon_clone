import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAuth } from '@hooks/useAuth';
import { FaSearch, FaTimes, FaMapMarkerAlt, FaShoppingCart, FaUser, FaHeart, FaBox, FaChevronDown, FaBars, FaSignOutAlt, FaCrown, FaClock, FaList } from 'react-icons/fa';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { searchQuery } = useSelector((state: RootState) => state.ui);

  // Search State
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);

  // Dropdown States
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Load cart count from localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0));

    const handleCartUpdate = (e: CustomEvent) => {
      setCartCount(e.detail.itemCount);
    };
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
  }, []);

  // Mock suggestions
  const suggestions = searchText.length >= 2 ? [
    `${searchText} headphones`,
    `${searchText} wireless`,
    `${searchText} bluetooth`,
    `${searchText} for men`,
    `${searchText} 2024`,
  ] : [];

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setSearchText('');
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setSearchText('');
    setShowSuggestions(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.account-dropdown')) setShowAccountDropdown(false);
      if (!target.closest('.search-container')) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setShowSuggestions(false);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {/* ========== TOP STRIP ========== */}
      <div className="bg-amazon-dark-gray text-white text-xs">
        <div className="max-w-amazon mx-auto flex items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-4">
            <span className="hover:text-amazon-orange cursor-pointer transition-colors">🇺🇸 English</span>
            <span className="hover:text-amazon-orange cursor-pointer transition-colors">📍 Deliver to Pakistan</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/orders" className="hover:text-amazon-orange transition-colors">Returns & Orders</Link>
            <Link to="/help" className="hover:text-amazon-orange transition-colors">Customer Service</Link>
            <Link to="/deals" className="hover:text-amazon-orange transition-colors font-medium">🔥 Today's Deals</Link>
          </div>
        </div>
      </div>

      {/* ========== MAIN HEADER ========== */}
      <header className="bg-amazon-navy text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-amazon mx-auto px-4 py-2.5">
          <div className="flex items-center gap-3">
            
            {/* ===== MOBILE MENU BUTTON ===== */}
            <button 
              className="lg:hidden p-2 hover:border hover:border-white rounded-sm transition-all"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <FaBars size={20} />
            </button>

            {/* ===== LOGO ===== */}
            <Link 
              to="/" 
              className="flex-shrink-0 group px-2 py-1.5 hover:border hover:border-white rounded-sm transition-all"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                <span className="text-white">ama</span>
                <span className="text-amazon-orange">zon</span>
              </span>
              <span className="hidden md:block text-[10px] text-amazon-orange -mt-0.5 leading-none">clone</span>
            </Link>

            {/* ===== DELIVERY LOCATION ===== */}
            <button className="hidden xl:flex items-center gap-1 px-2 py-1.5 hover:border hover:border-white rounded-sm transition-all group">
              <FaMapMarkerAlt className="text-amazon-orange group-hover:scale-110 transition-transform" size={18} />
              <div className="text-left leading-tight">
                <div className="text-xs text-gray-300">Deliver to</div>
                <div className="text-sm font-bold -mt-0.5">Select Location</div>
              </div>
            </button>

            {/* ===== SEARCH BAR ===== */}
            <div className="flex-1 max-w-3xl mx-auto search-container">
              <form onSubmit={handleSearch}>
                <div className={`flex items-center transition-all duration-300 ${isSearchFocused ? 'ring-4 ring-amazon-orange/30 rounded-lg' : 'rounded-lg'}`}>
                  {/* Category Dropdown */}
                  <div className="hidden md:block relative">
                    <select className="h-[42px] px-3 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-l-lg border-r-0 text-gray-700 cursor-pointer font-medium focus:outline-none appearance-none pr-7 transition-colors">
                      <option>All</option>
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Books</option>
                      <option>Home</option>
                      <option>Sports</option>
                    </select>
                    <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={10} />
                  </div>

                  {/* Input */}
                  <div className="relative flex-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchText}
                      onChange={(e) => { setSearchText(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => { setIsSearchFocused(true); if (searchText.length >= 2) setShowSuggestions(true); }}
                      onBlur={() => setIsSearchFocused(false)}
                      placeholder="Search Amazon..."
                      className="w-full h-[42px] px-4 text-sm border border-gray-300 md:rounded-none md:border-l-0 rounded-l-lg text-gray-900 placeholder-gray-500 focus:outline-none transition-all"
                    />
                    {searchText && (
                      <button type="button" onClick={() => { setSearchText(''); searchInputRef.current?.focus(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-all">
                        <FaTimes size={14} />
                      </button>
                    )}
                  </div>

                  {/* Search Button */}
                  <button type="submit" className="h-[42px] px-5 bg-amazon-orange hover:bg-amazon-orange-dark text-white rounded-r-lg transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center gap-1.5 font-medium">
                    <FaSearch size={18} />
                    <span className="hidden sm:inline text-sm">Search</span>
                  </button>
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchText.length >= 2 && (
                <div ref={suggestionsRef} className="absolute mt-1 w-full max-w-3xl bg-white border border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button key={index} onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0">
                      <FaSearch className="text-gray-400" size={12} />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ===== RIGHT SIDE ACTIONS ===== */}
            <div className="flex items-center gap-1 flex-shrink-0">
              
              {/* Language */}
              <button className="hidden lg:flex items-center px-2 py-1.5 hover:border hover:border-white rounded-sm transition-all">
                <span className="text-sm font-bold">EN</span>
                <FaChevronDown size={8} className="ml-0.5 text-gray-400" />
              </button>

              {/* Account Dropdown */}
              <div className="relative account-dropdown">
                <button onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex flex-col px-2 py-1.5 hover:border hover:border-white rounded-sm transition-all">
                  <span className="text-xs text-gray-300 leading-none">
                    {isAuthenticated ? `Hello, ${user?.firstName || 'User'}` : 'Hello, sign in'}
                  </span>
                  <span className="text-sm font-bold leading-tight flex items-center gap-0.5">
                    Account & Lists <FaChevronDown size={8} className="text-gray-400" />
                  </span>
                </button>

                {showAccountDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-72 bg-white text-gray-900 rounded-lg shadow-2xl border z-50 overflow-hidden">
                    {isAuthenticated ? (
                      <div className="p-2">
                        <div className="p-3 bg-gray-50 border-b mb-2">
                          <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm"><FaUser className="text-gray-400" /> Your Account</Link>
                        <Link to="/orders" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm"><FaBox className="text-gray-400" /> Your Orders</Link>
                        <Link to="/wishlist" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm"><FaHeart className="text-gray-400" /> Wishlist</Link>
                        <hr className="my-2" />
                        <button onClick={() => { logout(); setShowAccountDropdown(false); navigate('/'); }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded text-sm text-red-600"><FaSignOutAlt /> Sign Out</button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <button onClick={() => { navigate('/login'); setShowAccountDropdown(false); }}
                          className="w-full bg-amazon-yellow hover:bg-amazon-yellow-dark text-gray-900 font-medium py-2 px-6 rounded-full transition-colors text-sm">Sign In</button>
                        <p className="text-xs text-center mt-3 text-gray-600">New customer? <Link to="/register" onClick={() => setShowAccountDropdown(false)} className="text-amazon-blue hover:underline">Start here.</Link></p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Returns & Orders */}
              <Link to="/orders" className="hidden md:flex flex-col px-2 py-1.5 hover:border hover:border-white rounded-sm transition-all">
                <span className="text-xs text-gray-300 leading-none">Returns</span>
                <span className="text-sm font-bold leading-tight">& Orders</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center px-2 py-1.5 hover:border hover:border-white rounded-sm transition-all relative">
                <div className="relative">
                  <FaShoppingCart size={28} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-amazon-orange text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-bold mt-2 ml-0.5">Cart</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ===== SUB NAVIGATION ===== */}
        <nav className="bg-amazon-dark-gray text-white border-t border-gray-700">
          <div className="max-w-amazon mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              <button className="flex items-center gap-1.5 px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm font-medium flex-shrink-0">
                <FaBars size={14} /> All
              </button>
              <Link to="/deals" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0 hover:text-amazon-orange">Today's Deals</Link>
              <Link to="/products?category=electronics" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0">Electronics</Link>
              <Link to="/products?category=fashion" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0">Fashion</Link>
              <Link to="/products?category=books" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0">Books</Link>
              <Link to="/products?category=home-kitchen" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0">Home & Kitchen</Link>
              <Link to="/products?category=sports-outdoors" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0">Sports</Link>
              <Link to="/products?category=beauty" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0">Beauty</Link>
              <Link to="/products?category=toys-games" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0">Toys</Link>
              <Link to="/prime" className="px-3 py-2 hover:border hover:border-white rounded-sm transition-all text-sm flex-shrink-0 text-amazon-orange font-medium"><FaCrown className="inline mr-1" size={12} />Prime</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ===== MOBILE SIDEBAR ===== */}
      {showMobileMenu && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden shadow-2xl overflow-y-auto">
            <div className="bg-amazon-navy text-white p-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amazon-orange rounded-full flex items-center justify-center text-lg font-bold">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-300">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <button onClick={() => { navigate('/login'); setShowMobileMenu(false); }}
                  className="w-full bg-amazon-yellow text-gray-900 font-medium py-2 rounded-full text-sm">Sign In</button>
              )}
            </div>
            <div className="p-4 space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shop By Category</h3>
              {['Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys'].map(cat => (
                <Link key={cat} to={`/products?category=${cat.toLowerCase().replace(' & ', '-')}`} onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                  <span className="text-lg">{cat === 'Electronics' ? '🖥️' : cat === 'Fashion' ? '👗' : cat === 'Books' ? '📚' : cat === 'Home & Kitchen' ? '🏠' : cat === 'Sports' ? '⚽' : cat === 'Beauty' ? '💄' : '🧸'}</span>
                  {cat}
                </Link>
              ))}
              <hr className="my-3" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Help & Settings</h3>
              <Link to="/account" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm text-gray-700"><FaUser className="text-gray-400" /> Your Account</Link>
              <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm text-gray-700"><FaBox className="text-gray-400" /> Your Orders</Link>
              <Link to="/wishlist" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm text-gray-700"><FaHeart className="text-gray-400" /> Wishlist</Link>
              {isAuthenticated && (
                <>
                  <hr className="my-3" />
                  <button onClick={() => { logout(); setShowMobileMenu(false); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-lg text-sm text-red-600"><FaSignOutAlt /> Sign Out</button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;