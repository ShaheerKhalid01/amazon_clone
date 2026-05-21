import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface PrimeBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

/**
 * Prime Badge Component
 * Amazon Prime eligibility indicator
 */
const PrimeBadge: React.FC<PrimeBadgeProps> = ({
  size = 'md',
  showTooltip = true,
}) => {
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <div className="relative inline-flex items-center group">
      <span
        className={`
          ${sizes[size]}
          bg-amazon-blue text-white font-bold rounded
          inline-flex items-center gap-1
        `}
      >
        <FaCheck className="text-xs" />
        Prime
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg 
                      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          <div className="font-semibold mb-1">Amazon Prime</div>
          <div className="text-gray-300">
            <p>✓ FREE Two-Day Delivery</p>
            <p>✓ Exclusive deals & discounts</p>
            <p>✓ Premium entertainment</p>
          </div>
          <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
};

export default PrimeBadge;
