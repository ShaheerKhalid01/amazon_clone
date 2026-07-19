import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@components/ui/Button/Button';
import { formatPrice } from '@utils/formatPrice';
import { FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getApiUrl } from '@utils/apiBase';

const API_BASE = getApiUrl('');

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === 'true';

  // ✅ Simple auth check - localStorage
  const token = localStorage.getItem('accessToken');
  const isAuthenticated = !!token;

  const [shippingData, setShippingData] = useState({
    fullName: 'John Doe', phoneNumber: '+1-555-0123',
    streetAddress: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'United States',
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242424242424242', cardholderName: 'John Doe', expiryDate: '12/28', cvv: '123',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Get buy now item
  const buyNowItem = isBuyNow ? JSON.parse(localStorage.getItem('buyNowItem') || 'null') : null;
  // 👇 NAYA: agar buy-now nahi hai to normal cart se items lein (real checkout flow)
  const cartItems = !isBuyNow ? JSON.parse(localStorage.getItem('cartItems') || '[]') : [];
  const items = buyNowItem ? [buyNowItem] : cartItems;

  const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 25 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // 👇 UPDATED: ab real backend API ko call karta hai, sirf fake delay nahi
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item: any) => ({
            productId: item.productId,
            title: item.title,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: shippingData,
          subtotal,
          shippingCost,
          tax,
          total,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.message || 'Failed to place order');
        return;
      }

      // Order MongoDB mein save ho gaya — ab local cart/buyNow data clear kar dein
      localStorage.removeItem('buyNowItem');
      if (!isBuyNow) localStorage.removeItem('cartItems');
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemCount: 0 } }));

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error('Could not connect to the server');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">1. Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <input className="border rounded-lg px-3 py-2" placeholder="Full Name" value={shippingData.fullName} onChange={e => setShippingData({...shippingData, fullName: e.target.value})} />
              <input className="border rounded-lg px-3 py-2" placeholder="Phone" value={shippingData.phoneNumber} onChange={e => setShippingData({...shippingData, phoneNumber: e.target.value})} />
              <input className="border rounded-lg px-3 py-2 col-span-2" placeholder="Street Address" value={shippingData.streetAddress} onChange={e => setShippingData({...shippingData, streetAddress: e.target.value})} />
              <input className="border rounded-lg px-3 py-2" placeholder="City" value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} />
              <input className="border rounded-lg px-3 py-2" placeholder="State" value={shippingData.state} onChange={e => setShippingData({...shippingData, state: e.target.value})} />
              <input className="border rounded-lg px-3 py-2" placeholder="ZIP" value={shippingData.zipCode} onChange={e => setShippingData({...shippingData, zipCode: e.target.value})} />
              <input className="border rounded-lg px-3 py-2" placeholder="Country" value={shippingData.country} onChange={e => setShippingData({...shippingData, country: e.target.value})} />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">2. Payment Method</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <input className="border rounded-lg px-3 py-2 col-span-2" placeholder="Card Number" value={paymentData.cardNumber} onChange={e => setPaymentData({...paymentData, cardNumber: e.target.value})} />
              <input className="border rounded-lg px-3 py-2" placeholder="Cardholder Name" value={paymentData.cardholderName} onChange={e => setPaymentData({...paymentData, cardholderName: e.target.value})} />
              <input className="border rounded-lg px-3 py-2" placeholder="MM/YY" value={paymentData.expiryDate} onChange={e => setPaymentData({...paymentData, expiryDate: e.target.value})} />
              <input className="border rounded-lg px-3 py-2" placeholder="CVV" value={paymentData.cvv} onChange={e => setPaymentData({...paymentData, cvv: e.target.value})} />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">3. Order Items</h2>
            {items.length === 0 ? (
              <p className="text-sm text-gray-400">Your cart is empty.</p>
            ) : (
              items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                  <img src={item.image || 'https://via.placeholder.com/80'} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
              <hr />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-amazon-red">{formatPrice(total)}</span></div>
            </div>
            <Button variant="primary" size="lg" fullWidth className="mt-6" onClick={handlePlaceOrder} loading={isProcessing} disabled={items.length === 0}>
              <FaLock className="mr-2" />{isProcessing ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;