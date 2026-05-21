import React from 'react';
import { FaTruck, FaCalendarCheck, FaClock } from 'react-icons/fa';

interface DeliveryInfoProps {
  shipping?: {
    freeShipping: boolean;
    estimatedDelivery: {
      standard: { minDays: number; maxDays: number; businessDays?: boolean };
      expedited?: { minDays: number; maxDays: number };
      twoDay?: { minDays: number; maxDays: number };
      oneDay?: { minDays: number; maxDays: number };
    };
    shipsFrom: string;
  };
  isPrime?: boolean;
  zipCode?: string;
}

/**
 * Delivery Information Component
 */
const DeliveryInfo: React.FC<DeliveryInfoProps> = ({
  shipping,
  isPrime = false,
  zipCode = '10001',
}) => {
  const [showAllOptions, setShowAllOptions] = React.useState(false);

  const getDeliveryDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!shipping) return null;

  const { estimatedDelivery } = shipping;

  return (
    <div className="space-y-3">
      {/* Free Shipping */}
      <div className="flex items-start gap-2">
        <FaTruck className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {shipping.freeShipping ? 'FREE delivery' : `$${(5.99).toFixed(2)} delivery`}
          </p>
          <p className="text-sm text-gray-600">
            {getDeliveryDate(estimatedDelivery.standard.minDays)} -{' '}
            {getDeliveryDate(estimatedDelivery.standard.maxDays)}
          </p>
          {isPrime && (
            <p className="text-xs text-amazon-blue font-medium mt-1">
              FREE Prime delivery
            </p>
          )}
        </div>
      </div>

      {/* Fastest Delivery */}
      {estimatedDelivery.twoDay && (
        <div className="flex items-start gap-2">
          <FaCalendarCheck className="text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Fastest delivery</p>
            <p className="text-sm text-gray-600">
              {getDeliveryDate(estimatedDelivery.twoDay.minDays)}
            </p>
          </div>
        </div>
      )}

      {/* More Options */}
      <button
        onClick={() => setShowAllOptions(!showAllOptions)}
        className="text-sm text-amazon-blue hover:underline"
      >
        {showAllOptions ? 'Fewer options' : 'More delivery options'}
      </button>

      {showAllOptions && (
        <div className="pl-6 space-y-2 animate-fade-in">
          {estimatedDelivery.expedited && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Expedited</span>
              <span className="text-sm font-medium">
                {getDeliveryDate(estimatedDelivery.expedited.minDays)} -{' '}
                {getDeliveryDate(estimatedDelivery.expedited.maxDays)}
              </span>
              <span className="text-sm font-bold">$12.99</span>
            </div>
          )}
          {estimatedDelivery.oneDay && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">One-Day</span>
              <span className="text-sm font-medium">
                {getDeliveryDate(estimatedDelivery.oneDay.minDays)}
              </span>
              <span className="text-sm font-bold">$24.99</span>
            </div>
          )}
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">Standard</span>
            <span className="text-sm font-medium">
              {getDeliveryDate(estimatedDelivery.standard.minDays)} -{' '}
              {getDeliveryDate(estimatedDelivery.standard.maxDays)}
            </span>
            <span className="text-sm font-bold">
              {shipping.freeShipping ? 'FREE' : '$5.99'}
            </span>
          </div>
        </div>
      )}

      {/* Delivery Location */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FaClock className="flex-shrink-0" />
        <span>
          Order within <span className="text-green-600 font-medium">2 hrs 30 mins</span> to receive by{' '}
          <span className="font-medium">{getDeliveryDate(estimatedDelivery.standard.minDays)}</span>
        </span>
      </div>

      {/* Ships From */}
      <p className="text-xs text-gray-500">
        Ships from: <span className="font-medium">{shipping.shipsFrom}</span>
      </p>
    </div>
  );
};

export default DeliveryInfo;
