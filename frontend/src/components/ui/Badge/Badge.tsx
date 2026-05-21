import React from 'react';

interface BadgeProps {
  variant?: 'best-seller' | 'amazon-choice' | 'prime' | 'sale' | 'new' | 'coupon';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

/**
 * Badge Component
 * Used for product badges (Best Seller, Amazon's Choice, etc.)
 */
const Badge: React.FC<BadgeProps> = ({
  variant = 'best-seller',
  size = 'sm',
  children,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded';

  const variants = {
    'best-seller': 'bg-amazon-orange text-white',
    'amazon-choice': 'bg-amazon-navy text-white',
    prime: 'bg-amazon-blue text-white',
    sale: 'bg-amazon-red text-white',
    new: 'bg-green-500 text-white',
    coupon: 'bg-amazon-green text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
