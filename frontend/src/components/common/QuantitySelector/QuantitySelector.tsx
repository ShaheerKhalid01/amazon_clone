import React from 'react';
import { FaMinus, FaPlus, FaChevronDown } from 'react-icons/fa';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity?: number;
  minQuantity?: number;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'buttons' | 'dropdown';
  disabled?: boolean;
}

/**
 * Quantity Selector Component
 */
const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxQuantity = 50,
  minQuantity = 1,
  onChange,
  size = 'md',
  variant = 'buttons',
  disabled = false,
}) => {
  const sizes = {
    sm: { button: 'p-1 text-sm', input: 'w-8 text-sm', gap: 'gap-1' },
    md: { button: 'p-2 text-base', input: 'w-12 text-base', gap: 'gap-2' },
    lg: { button: 'p-3 text-lg', input: 'w-16 text-lg', gap: 'gap-3' },
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      onChange(Math.min(Math.max(value, minQuantity), maxQuantity));
    }
  };

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <select
          value={quantity}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="px-3 py-2 border rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 
                   focus:ring-amazon-orange disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
      </div>
    );
  }

  // Buttons variant (default)
  return (
    <div className={`inline-flex items-center ${sizes[size].gap}`}>
      <button
        onClick={handleDecrement}
        disabled={disabled || quantity <= minQuantity}
        className={`
          ${sizes[size].button}
          border rounded-lg
          hover:bg-gray-100 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-amazon-orange
        `}
        aria-label="Decrease quantity"
      >
        <FaMinus className="text-xs" />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={minQuantity}
        max={maxQuantity}
        disabled={disabled}
        className={`
          ${sizes[size].input}
          text-center border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-amazon-orange
          disabled:opacity-50 disabled:cursor-not-allowed
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        `}
      />

      <button
        onClick={handleIncrement}
        disabled={disabled || quantity >= maxQuantity}
        className={`
          ${sizes[size].button}
          border rounded-lg
          hover:bg-gray-100 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-amazon-orange
        `}
        aria-label="Increase quantity"
      >
        <FaPlus className="text-xs" />
      </button>

      {quantity >= maxQuantity && (
        <span className="text-xs text-red-500">Max</span>
      )}
    </div>
  );
};

export default QuantitySelector;
