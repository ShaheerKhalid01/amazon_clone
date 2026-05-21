import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

/**
 * BackToTopButton – appears after scrolling down a certain distance.
 * Smooth scrolls to the top when clicked.
 */
const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>{isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3 bg-amazon-orange text-white rounded-full shadow-lg hover:bg-amazon-orange-dark focus:outline-none focus:ring-2 focus:ring-amazon-orange transition-colors"
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>
    )}</>
  );
};

export default BackToTopButton;
