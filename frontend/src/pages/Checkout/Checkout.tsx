import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@hooks/useCart';
import { useAuth } from '@hooks/useAuth';
import CheckoutSteps from '@components/checkout/CheckoutSteps/CheckoutSteps';
import ShippingAddress from '@components/checkout/ShippingAddress/ShippingAddress';
import PaymentMethod from '@components/checkout/PaymentMethod/PaymentMethod';
import OrderReview from '@components/checkout/OrderReview/OrderReview';
import Button from '@components/ui/Button/Button';
import { formatPrice } from '@utils/formatPrice';
import { FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Checkout Page Component
 * Multi-step checkout process
 */
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, itemCount, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [shippingData, setShippingData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Checkout steps configuration
  const steps = [
    { id: 'shipping', label: 'Shipping', number: 1 },
    { id: 'payment', label: 'Payment', number: 2 },
    { id: 'review', label: 'Review', number: 3 },
  ];

  // Pricing calculations
  const subtotal = cart?.subtotal || 0;
  const shippingCost = subtotal > 25 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax - promoDiscount;

  /**
   * Handle shipping form submission
   */
  const handleShippingSubmit = (data: any) => {
    setShippingData(data);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle payment form submission
   */
  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle place order
   */
  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Apply promo code
   */
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoDiscount(subtotal * 0.1);
      toast.success('10% discount applied!');
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setPromoDiscount(subtotal * 0.2);
      toast.success('20% discount applied!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  /**
   * Go back to previous step
   */
  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-amazon mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add items to your cart to checkout</p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <FaLock className="text-green-600" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Steps Progress */}
      <CheckoutSteps steps={steps} currentStep={currentStep} />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Step 0: Shipping Address */}
          {currentStep === 0 && (
            <ShippingAddress
              user={user}
              onSubmit={handleShippingSubmit}
              initialData={shippingData}
            />
          )}

          {/* Step 1: Payment Method */}
          {currentStep === 1 && (
            <PaymentMethod
              onSubmit={handlePaymentSubmit}
              onBack={handleBack}
              initialData={paymentData}
            />
          )}

          {/* Step 2: Order Review */}
          {currentStep === 2 && (
            <OrderReview
              cart={cart}
              shippingData={shippingData}
              paymentData={paymentData}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              promoDiscount={promoDiscount}
              total={total}
              onPlaceOrder={handlePlaceOrder}
              onBack={handleBack}
              isProcessing={isProcessing}
            />
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-80">
          <div className="sticky top-24">
            <div className="card-amazon p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({itemCount})</span>
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

              {/* Promo Code */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                  />
                  <Button variant="secondary" size="sm" onClick={handleApplyPromo}>
                    Apply
                  </Button>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < 25 && (
                <div className="mt-4 p-3 bg-amazon-orange bg-opacity-10 rounded-lg text-sm">
                  <p className="text-gray-700">
                    Add {formatPrice(25 - subtotal)} more for FREE shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
