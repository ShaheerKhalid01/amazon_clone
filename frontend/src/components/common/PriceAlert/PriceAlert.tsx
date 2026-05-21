import React, { useState } from 'react';
import Button from '@components/ui/Button/Button';
import { FaBell, FaBellSlash, FaDollarSign } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface PriceAlertProps {
  productId: string;
  productTitle: string;
  currentPrice: number;
}

/**
 * Price Alert Component
 * Allows users to set price drop alerts
 */
const PriceAlert: React.FC<PriceAlertProps> = ({
  productId,
  productTitle,
  currentPrice,
}) => {
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [targetPrice, setTargetPrice] = useState<number>(currentPrice * 0.8);
  const [showForm, setShowForm] = useState(false);

  const handleSetAlert = () => {
    setIsAlertSet(true);
    setShowForm(false);
    toast.success(`Alert set! We'll notify you when price drops below $${targetPrice.toFixed(2)}`);
  };

  const handleRemoveAlert = () => {
    setIsAlertSet(false);
    toast.success('Price alert removed');
  };

  return (
    <div>
      {!isAlertSet ? (
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-sm text-amazon-blue hover:underline"
          >
            <FaBell />
            <span>Set Price Alert</span>
          </button>

          {showForm && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg animate-fade-in">
              <p className="text-sm text-gray-700 mb-3">
                Get notified when the price drops below your target
              </p>
              <div className="flex items-center gap-2 mb-3">
                <FaDollarSign className="text-gray-400" />
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                  className="w-24 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={handleSetAlert}>
                  Set Alert
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleRemoveAlert}
          className="flex items-center gap-2 text-sm text-green-600 font-medium"
        >
          <FaBellSlash />
          <span>Alert set for ${targetPrice.toFixed(2)} - Remove</span>
        </button>
      )}
    </div>
  );
};

export default PriceAlert;
