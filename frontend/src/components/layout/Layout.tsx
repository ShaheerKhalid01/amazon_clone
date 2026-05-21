import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { setMobileMenuOpen } from '@store/slices/uiSlice';

/**
 * Main Layout Component
 * Wraps all pages with header and footer
 */
const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const { mobileMenuOpen } = useSelector((state: RootState) => state.ui);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-amazon-light-gray">
      <Header />
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(setMobileMenuOpen(false))}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-amazon-dark-gray text-white p-3 rounded-full shadow-lg hover:bg-amazon-gray transition-all duration-200 z-50 animate-fade-in"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Layout;
