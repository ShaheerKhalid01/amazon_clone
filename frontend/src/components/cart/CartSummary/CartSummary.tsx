import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@utils/formatPrice';
import Button from '@components/ui/Button/Button';
import { FaTag, FaCheck, FaLock } from 'react-icons/fa';

interface CartSummaryProps {
  cart: any;
  itemCount: number;
}

/**
 * Cart Summary Component
 * Shows order totals and checkout button
 */
const CartSummary: React.FC<CartSummaryProps> = ({ cart, itemCount }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = cart?.subtotal || 0;
  const savings = cart?.totalSavings || 0;
  const couponDiscount = cart?.couponDiscount || 0;
  const total = cart?.total || subtotal;
  const estimatedTax = total * 0.08; // 8% estimated tax

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      // TODO: Apply coupon via API
    }
  };

  return (
    <div className="card-amazon p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

      {/* Subtotal */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Savings</span>
            <span className="text-green-600 font-medium">-{formatPrice(savings)}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Coupon Discount</span>
            <span className="text-green-600 font-medium">-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600 font-medium">FREE</span>
        </div>

        {/* Estimated Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated Tax</span>
          <span className="font-medium">{formatPrice(estimatedTax)}</span>
        </div>

        <hr />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Order Total</span>
          <span className="text-amazon-red">{formatPrice(total + estimatedTax)}</span>
        </div>
      </div>

      {/* Coupon Code */}
      {!appliedCoupon ? (
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            />
            <Button variant="secondary" size="sm" onClick={handleApplyCoupon}>
              Apply
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <FaCheck />
            <span>Coupon <strong>{appliedCoupon}</strong> applied</span>
          </div>
          <button
            onClick={() => setAppliedCoupon(null)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      )}

      {/* Checkout Button */}
      <Link to="/checkout">
        <Button variant="primary" size="lg" fullWidth>
          Proceed to Checkout
        </Button>
      </Link>

      {/* Secure Checkout */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <FaLock />
        <span>Secure Checkout</span>
      </div>
    </div>
  );
};

export default CartSummary;
