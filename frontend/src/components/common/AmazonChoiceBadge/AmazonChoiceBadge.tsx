import React from 'react';

interface AmazonChoiceBadgeProps {
  keyword?: string;
  size?: 'sm' | 'md';
}

/**
 * Amazon's Choice Badge Component
 */
const AmazonChoiceBadge: React.FC<AmazonChoiceBadgeProps> = ({
  keyword = 'products',
  size = 'md',
}) => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <div className="inline-flex items-center gap-1 bg-amazon-navy text-white rounded-md overflow-hidden">
      <span className={`${sizes[size]} font-bold bg-amazon-orange px-2 py-1`}>
        Amazon's
      </span>
      <span className={`${sizes[size]} font-bold px-2 py-1`}>
        Choice
      </span>
      <span className={`${sizes[size]} text-gray-300 px-2 py-1 bg-amazon-dark-gray`}>
        in {keyword}
      </span>
    </div>
  );
};

export default AmazonChoiceBadge;
