import React from 'react';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  // Check login
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>

      {!token ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">📦</p>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Please Sign In</h2>
          <p className="text-gray-500 mb-4">Login to view your orders</p>
          <Link to="/login" className="bg-amazon-orange text-white px-6 py-2 rounded-full font-medium hover:bg-amazon-orange-dark">
            Sign In
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Sample Order */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">ORDER PLACED</p>
                <p className="text-sm font-medium">May 25, 2026</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">TOTAL</p>
                <p className="text-sm font-medium">$199.98</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ORDER #</p>
                <p className="text-sm font-medium text-amazon-blue">113-8795423-9876254</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" alt="Product" className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">Wireless Bluetooth Headphones</h3>
                <p className="text-sm text-gray-500">Qty: 2</p>
                <p className="text-sm text-green-600 font-medium mt-1">✅ Delivered</p>
              </div>
              <Link to="/orders/1" className="text-amazon-blue text-sm hover:underline">View Details</Link>
            </div>
          </div>

          {/* Sample Order 2 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">ORDER PLACED</p>
                <p className="text-sm font-medium">May 20, 2026</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">TOTAL</p>
                <p className="text-sm font-medium">$59.99</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ORDER #</p>
                <p className="text-sm font-medium text-amazon-blue">113-8795423-9876255</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <img src="https://images.unsplash.com/photo-1589998059171-988d0df3a8b3?w=100&h=100&fit=crop" alt="Product" className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">Digital Quran Pen Reader</h3>
                <p className="text-sm text-gray-500">Qty: 1</p>
                <p className="text-sm text-blue-600 font-medium mt-1">🚚 Shipped</p>
              </div>
              <Link to="/orders/2" className="text-amazon-blue text-sm hover:underline">Track Package</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;