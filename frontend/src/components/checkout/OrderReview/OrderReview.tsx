import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/ui/Button/Button';
import { formatPrice } from '@utils/formatPrice';
import { FaArrowLeft, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';

interface OrderReviewProps {
  cart: any;
  shippingData: any;
  paymentData: any;
  subtotal: number;
  shippingCost: number;
  tax: number;
  promoDiscount: number;
  total: number;
  onPlaceOrder: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

/**
 * Order Review Component
 */
const OrderReview: React.FC<OrderReviewProps> = ({
  cart,
  shippingData,
  paymentData,
  subtotal,
  shippingCost,
  tax,
  promoDiscount,
  total,
  onPlaceOrder,
  onBack,
  isProcessing,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>

      {/* Shipping Address */}
      <div className="card-amazon p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-gray-900">
            <FaTruck className="inline mr-2 text-amazon-orange" />
            Shipping Address
          </h3>
          <button onClick={onBack} className="text-sm text-amazon-blue hover:underline">
            Change
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-900">{shippingData?.fullName}</p>
          <p>{shippingData?.streetAddress}</p>
          {shippingData?.apartment && <p>{shippingData.apartment}</p>}
          <p>{shippingData?.city}, {shippingData?.state} {shippingData?.zipCode}</p>
          <p>{shippingData?.country}</p>
          <p className="mt-1">{shippingData?.phoneNumber}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card-amazon p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-gray-900">
            <FaShieldAlt className="inline mr-2 text-amazon-orange" />
            Payment Method
          </h3>
          <button onClick={() => onBack()} className="text-sm text-amazon-blue hover:underline">
            Change
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>Card ending in {paymentData?.cardNumber?.slice(-4)}</p>
          <p>{paymentData?.cardholderName}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="card-amazon p-6 mb-4">
        <h3 className="font-semibold text-gray-900 mb-4">
          Items ({cart?.itemCount || 0})
        </h3>
        <div className="divide-y">
          {cart?.items?.map((item: any) => (
            <div key={item.productId} className="py-4 flex gap-4">
              <img
                src={item.image || '/placeholder.png'}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatPrice(item.totalPrice || item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="card-amazon p-6 mb-4">
        <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className={shippingCost === 0 ? 'text-green-600' : ''}>
              {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo Discount</span>
              <span>-{formatPrice(promoDiscount)}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Order Total</span>
            <span className="text-amazon-red">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-1">
          <FaShieldAlt className="text-green-600" />
          <span>Secure Transaction</span>
        </div>
        <div className="flex items-center gap-1">
          <FaUndo className="text-blue-600" />
          <span>30-Day Returns</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={onPlaceOrder}
          loading={isProcessing}
        >
          {isProcessing ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
};

export default OrderReview;
