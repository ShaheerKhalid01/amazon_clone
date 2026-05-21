import React from 'react';
import { FaTag } from 'react-icons/fa';

interface CouponBadgeProps {
  value: number;
  type?: 'percentage' | 'fixed';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Coupon Badge Component
 */
const CouponBadge: React.FC<CouponBadgeProps> = ({
  value,
  type = 'percentage',
  label,
  size = 'md',
  onClick,
}) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const displayValue = type === 'percentage' ? `${value}%` : `$${value}`;
  const displayLabel = label || (type === 'percentage' ? 'off' : 'off your order');

  return (
    <button
      onClick={onClick}
      className={`
        ${sizes[size]}
        bg-green-50 border border-green-200 text-green-700
        hover:bg-green-100 transition-colors rounded-lg
        inline-flex items-center font-medium
      `}
    >
      <FaTag className="text-green-600" />
      <span className="text-green-800 font-bold">{displayValue}</span>
      <span>{displayLabel}</span>
    </button>
  );
};

export default CouponBadge;
