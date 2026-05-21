import React from 'react';

interface StockIndicatorProps {
  availability: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK' | 'PRE_ORDER';
  quantity?: number;
  showQuantity?: boolean;
}

/**
 * Stock Indicator Component
 */
const StockIndicator: React.FC<StockIndicatorProps> = ({
  availability,
  quantity,
  showQuantity = true,
}) => {
  const config = {
    IN_STOCK: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      dot: 'bg-green-500',
      label: 'In Stock',
      icon: '✓',
    },
    OUT_OF_STOCK: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      dot: 'bg-red-500',
      label: 'Out of Stock',
      icon: '×',
    },
    LOW_STOCK: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      dot: 'bg-yellow-500',
      label: 'Low Stock',
      icon: '!',
    },
    PRE_ORDER: {
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      dot: 'bg-blue-500',
      label: 'Pre-order',
      icon: '⟳',
    },
  };

  const { color, bgColor, dot, label, icon } = config[availability] || config.IN_STOCK;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColor} ${color} text-sm font-medium`}>
      <span className={`w-2 h-2 ${dot} rounded-full animate-pulse`} />
      <span>{label}</span>
      {showQuantity && quantity !== undefined && availability === 'IN_STOCK' && (
        <span className="text-gray-500 font-normal">
          ({quantity} available)
        </span>
      )}
      {availability === 'LOW_STOCK' && quantity !== undefined && quantity > 0 && (
        <span className="text-yellow-700 font-normal">
          Only {quantity} left
        </span>
      )}
    </div>
  );
};

export default StockIndicator;
