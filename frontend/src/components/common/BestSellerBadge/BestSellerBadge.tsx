import React from 'react';

interface BestSellerBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  category?: string;
}

/**
 * Best Seller Badge Component
 */
const BestSellerBadge: React.FC<BestSellerBadgeProps> = ({
  size = 'md',
  category,
}) => {
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        ${sizes[size]}
        bg-amazon-orange text-white font-medium rounded-full
        inline-flex items-center gap-1
      `}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Best Seller
      {category && <span className="font-normal opacity-90">in {category}</span>}
    </span>
  );
};

export default BestSellerBadge;
