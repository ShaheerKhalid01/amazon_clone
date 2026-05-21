import React from 'react';

interface ProductVariantsProps {
  options: Array<{
    name: string;
    values: string[];
    type: 'dropdown' | 'color' | 'button' | 'radio';
  }>;
  variants: Array<{
    id: string;
    optionValues: Record<string, string>;
    price: number;
    availability: string;
    isDefault: boolean;
  }>;
  selectedVariant: string;
  onVariantChange: (variantId: string) => void;
}

/**
 * Product Variants Selector Component
 */
const ProductVariants: React.FC<ProductVariantsProps> = ({
  options,
  variants,
  selectedVariant,
  onVariantChange,
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});

  // Find matching variant
  const findMatchingVariant = (options: Record<string, string>) => {
    return variants.find(variant =>
      Object.entries(options).every(
        ([key, value]) => variant.optionValues[key] === value
      )
    );
  };

  // Handle option change
  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const matchingVariant = findMatchingVariant(newOptions);
    if (matchingVariant) {
      onVariantChange(matchingVariant.id);
    }
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.name}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {option.name}:{' '}
            <span className="font-normal text-gray-500">
              {selectedOptions[option.name] || 'Select'}
            </span>
          </label>

          {/* Color Swatches */}
          {option.type === 'color' && (
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all
                    ${selectedOptions[option.name] === value
                      ? 'border-amazon-orange ring-2 ring-amazon-orange ring-offset-2'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  style={{ backgroundColor: value.toLowerCase() }}
                  title={value}
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          {(option.type === 'button' || option.type === 'radio') && (
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isAvailable = variants.some(
                  v => v.optionValues[option.name] === value && v.availability === 'IN_STOCK'
                );

                return (
                  <button
                    key={value}
                    onClick={() => isAvailable && handleOptionChange(option.name, value)}
                    disabled={!isAvailable}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                      ${selectedOptions[option.name] === value
                        ? 'border-amazon-orange bg-amazon-orange bg-opacity-10 text-amazon-orange'
                        : isAvailable
                        ? 'border-gray-300 hover:border-gray-400 text-gray-700'
                        : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                      }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          )}

          {/* Dropdown */}
          {option.type === 'dropdown' && (
            <select
              value={selectedOptions[option.name] || ''}
              onChange={(e) => handleOptionChange(option.name, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            >
              <option value="">Select {option.name}</option>
              {option.values.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Selected: {Object.values(selectedOptions).join(' / ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;
