import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { FaSearch, FaTimes, FaMapMarkerAlt, FaShoppingCart, FaUser, FaHeart, FaBox, FaChevronDown, FaBars, FaSignOutAlt, FaCrown } from 'react-icons/fa';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0));

    const handleCartUpdate = (e: CustomEvent) => setCartCount(e.detail.itemCount);
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setSearchText('');
    }
  };

  return (
    <>
      <div className="bg-amazon-dark-gray text-white text-xs">
        <div className="max-w-amazon mx-auto flex items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-4">
            <span className="hover:text-amazon-orange cursor-pointer">🇺🇸 English</span>
            <span className="hover:text-amazon-orange cursor-pointer">📍 Deliver to Pakistan</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/orders" className="hover:text-amazon-orange">Returns & Orders</Link>
            <Link to="/help" className="hover:text-amazon-orange">Customer Service</Link>
            <Link to="/deals" className="hover:text-amazon-orange font-medium">🔥 Today's Deals</Link>
          </div>
        </div>
      </div>

      <header className="bg-amazon-navy text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-amazon mx-auto px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <FaBars size={20} />
            </button>

            <Link to="/" className="flex-shrink-0 px-2 py-1.5" onClick={() => window.scrollTo(0, 0)}>
              <span className="text-2xl md:text-3xl font-extrabold">
                <span className="text-white">ama</span><span className="text-amazon-orange">zon</span>
              </span>
            </Link>

            <div className="flex-1 max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1">
                  <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search Amazon..." className="w-full h-[42px] px-4 text-sm border border-gray-300 rounded-l-lg text-gray-900 focus:outline-none" />
                  {searchText && (
                    <button type="button" onClick={() => setSearchText('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
                <button type="submit" className="h-[42px] px-5 bg-amazon-orange hover:bg-amazon-orange-dark text-white rounded-r-lg">
                  <FaSearch size={18} />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="relative account-dropdown">
                <button onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex flex-col px-2 py-1.5 hover:border hover:border-white rounded-sm">
                  <span className="text-xs text-gray-300">{isAuthenticated ? `Hello, ${user?.firstName || 'User'}` : 'Hello, sign in'}</span>
                  <span className="text-sm font-bold">Account & Lists <FaChevronDown size={8} className="inline text-gray-400" /></span>
                </button>
                {showAccountDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-72 bg-white text-gray-900 rounded-lg shadow-2xl border z-50">
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
                        <button onClick={() => { logout(); setShowAccountDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded text-sm text-red-600"><FaSignOutAlt /> Sign Out</button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <button onClick={() => { navigate('/login'); setShowAccountDropdown(false); }} className="w-full bg-amazon-yellow hover:bg-amazon-yellow-dark text-gray-900 font-medium py-2 px-6 rounded-full text-sm">Sign In</button>
                        <p className="text-xs text-center mt-3 text-gray-600">New customer? <Link to="/register" onClick={() => setShowAccountDropdown(false)} className="text-amazon-blue hover:underline">Start here.</Link></p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link to="/orders" className="hidden md:flex flex-col px-2 py-1.5 hover:border hover:border-white rounded-sm">
                <span className="text-xs text-gray-300">Returns</span>
                <span className="text-sm font-bold">& Orders</span>
              </Link>

              <Link to="/cart" className="flex items-center px-2 py-1.5 hover:border hover:border-white rounded-sm relative">
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

        <nav className="bg-amazon-dark-gray text-white border-t border-gray-700">
          <div className="max-w-amazon mx-auto px-4 flex items-center gap-1 overflow-x-auto">
            <Link to="/deals" className="px-3 py-2 hover:text-amazon-orange text-sm flex-shrink-0">Today's Deals</Link>
            <Link to="/products?category=electronics" className="px-3 py-2 text-sm flex-shrink-0 hover:text-white">Electronics</Link>
            <Link to="/products?category=fashion" className="px-3 py-2 text-sm flex-shrink-0 hover:text-white">Fashion</Link>
            <Link to="/products?category=books" className="px-3 py-2 text-sm flex-shrink-0 hover:text-white">Books</Link>
            <Link to="/products?category=home-kitchen" className="px-3 py-2 text-sm flex-shrink-0 hover:text-white">Home & Kitchen</Link>
            <Link to="/prime" className="px-3 py-2 text-sm flex-shrink-0 text-amazon-orange font-medium"><FaCrown className="inline mr-1" size={12} />Prime</Link>
          </div>
        </nav>
      </header>

      {showMobileMenu && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden shadow-2xl overflow-y-auto">
            <div className="bg-amazon-navy text-white p-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amazon-orange rounded-full flex items-center justify-center text-lg font-bold">{user?.firstName?.[0] || 'U'}</div>
                  <div>
                    <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-300">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <button onClick={() => { navigate('/login'); setShowMobileMenu(false); }} className="w-full bg-amazon-yellow text-gray-900 font-medium py-2 rounded-full text-sm">Sign In</button>
              )}
            </div>
            <div className="p-4 space-y-1">
              {['Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys'].map(cat => (
                <Link key={cat} to={`/products?category=${cat.toLowerCase().replace(' & ', '-')}`} onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                  {cat}
                </Link>
              ))}
              <hr className="my-3" />
              <Link to="/account" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm"><FaUser /> Your Account</Link>
              <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm"><FaBox /> Your Orders</Link>
              <Link to="/wishlist" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm"><FaHeart /> Wishlist</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;