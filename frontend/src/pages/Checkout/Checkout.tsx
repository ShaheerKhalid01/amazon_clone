import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import Button from '@components/ui/Button/Button';
import { formatPrice } from '@utils/formatPrice';
import { FaLock, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === 'true';
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('accessToken');

  const [shippingData, setShippingData] = useState({
    fullName: 'John Doe',
    phoneNumber: '+1-555-0123',
    streetAddress: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242424242424242',
    cardholderName: 'John Doe',
    expiryDate: '12/28',
    cvv: '123',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Get items from cart (Redux) OR buyNow from localStorage
  const buyNowItem = isBuyNow ? JSON.parse(localStorage.getItem('buyNowItem') || 'null') : null;

  const items = buyNowItem
    ? [buyNowItem]
    : []; // Cart items from Redux (skip for now)

  const subtotal = items.reduce((sum: number, item: any) => sum + (item.totalPrice || item.price * item.quantity), 0);
  const shippingCost = subtotal > 25 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated && !token) {
      navigate('/login');
    }
  }, [isAuthenticated, token, navigate]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // ✅ Simulate order placement (no backend call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear buy now item
      localStorage.removeItem('buyNowItem');

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated && !token) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <Button variant="primary" onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">1. Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <input className="border rounded-lg px-3 py-2" placeholder="Full Name" value={shippingData.fullName} onChange={e => setShippingData({ ...shippingData, fullName: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="Phone" value={shippingData.phoneNumber} onChange={e => setShippingData({ ...shippingData, phoneNumber: e.target.value })} />
              <input className="border rounded-lg px-3 py-2 col-span-2" placeholder="Street Address" value={shippingData.streetAddress} onChange={e => setShippingData({ ...shippingData, streetAddress: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="City" value={shippingData.city} onChange={e => setShippingData({ ...shippingData, city: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="State" value={shippingData.state} onChange={e => setShippingData({ ...shippingData, state: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="ZIP" value={shippingData.zipCode} onChange={e => setShippingData({ ...shippingData, zipCode: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="Country" value={shippingData.country} onChange={e => setShippingData({ ...shippingData, country: e.target.value })} />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">2. Payment Method</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <input className="border rounded-lg px-3 py-2 col-span-2" placeholder="Card Number" value={paymentData.cardNumber} onChange={e => setPaymentData({ ...paymentData, cardNumber: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="Cardholder Name" value={paymentData.cardholderName} onChange={e => setPaymentData({ ...paymentData, cardholderName: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="MM/YY" value={paymentData.expiryDate} onChange={e => setPaymentData({ ...paymentData, expiryDate: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="CVV" value={paymentData.cvv} onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value })} />
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">3. Order Items</h2>
            {items.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                <img src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop'} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold">{formatPrice(item.totalPrice || item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>{formatPrice(tax)}</span></div>
              <hr />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-amazon-red">{formatPrice(total)}</span></div>
            </div>
            <Button variant="primary" size="lg" fullWidth className="mt-6" onClick={handlePlaceOrder} loading={isProcessing}>
              <FaLock className="mr-2" />
              {isProcessing ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;