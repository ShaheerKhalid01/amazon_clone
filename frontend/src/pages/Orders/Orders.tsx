import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@utils/formatPrice';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Order status ko friendly label/icon mein convert karta hai ──────────
const statusDisplay: Record<string, { label: string; className: string; icon: string }> = {
  PENDING: { label: 'Order Placed', className: 'text-gray-600', icon: '🕓' },
  PROCESSING: { label: 'Processing', className: 'text-yellow-600', icon: '⚙️' },
  SHIPPED: { label: 'Shipped', className: 'text-blue-600', icon: '🚚' },
  DELIVERED: { label: 'Delivered', className: 'text-green-600', icon: '✅' },
  CANCELLED: { label: 'Cancelled', className: 'text-red-600', icon: '❌' },
};

const Orders: React.FC = () => {
  // Check login
  const token = localStorage.getItem('accessToken');

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Real orders fetch karein backend se ─────────────────────────────
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const json = await res.json();
        if (json.success) {
          setOrders(json.data.orders);
        } else {
          toast.error(json.message || 'Failed to load orders');
        }
      } catch (err) {
        toast.error('Could not connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // ── Real-time: order status change hote hi turant update, bina refresh ke ─────
  useEffect(() => {
    if (!token) return;

    const socket: Socket = io(`${API_BASE.replace('/api', '')}/orders`, {
      auth: { token },
    });

    socket.on('order:update', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    socket.on('connect_error', (err) => {
      console.log('Orders socket connect failed:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

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
      ) : loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <FaSpinner className="animate-spin mr-2" size={20} /> Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">📦</p>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-4">When you place an order, it'll show up here.</p>
          <Link to="/" className="bg-amazon-orange text-white px-6 py-2 rounded-full font-medium hover:bg-amazon-orange-dark">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const status = statusDisplay[order.status] || statusDisplay.PENDING;
            return (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-gray-500">ORDER PLACED</p>
                    <p className="text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">TOTAL</p>
                    <p className="text-sm font-medium">{formatPrice(order.total || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ORDER #</p>
                    <p className="text-sm font-medium text-amazon-blue">{order._id.slice(-12).toUpperCase()}</p>
                  </div>
                </div>

                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 items-center py-2 border-t first:border-t-0">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className={`text-sm font-medium mt-1 ${status.className}`}>
                        {status.icon} {status.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;