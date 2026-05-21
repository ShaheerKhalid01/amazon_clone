import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import OrderCard from '@components/order/OrderCard/OrderCard';
import Button from '@components/ui/Button/Button';
import Spinner from '@components/ui/Spinner/Spinner';
import { FaSearch, FaBoxOpen, FaFilter } from 'react-icons/fa';

/**
 * Orders Page Component
 * Displays user's order history
 */
const Orders: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filter = searchParams.get('filter') || 'all';
  const timeFilter = searchParams.get('time') || 'last30';

  // Mock orders data
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', { filter, timeFilter, searchQuery }],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: '1',
          orderNumber: '113-8795423-9876254',
          date: '2024-01-15',
          total: 129.99,
          status: 'DELIVERED',
          items: [
            {
              title: 'Wireless Bluetooth Headphones',
              image: '/placeholder.png',
              quantity: 1,
            },
          ],
          trackingNumber: '1Z999AA10123456784',
          estimatedDelivery: '2024-01-20',
        },
        {
          id: '2',
          orderNumber: '113-8795423-9876255',
          date: '2024-01-10',
          total: 49.99,
          status: 'SHIPPED',
          items: [
            {
              title: 'Yoga Mat Premium',
              image: '/placeholder.png',
              quantity: 2,
            },
          ],
          trackingNumber: '1Z999AA10123456785',
          estimatedDelivery: '2024-01-18',
        },
        {
          id: '3',
          orderNumber: '113-8795423-9876256',
          date: '2024-01-05',
          total: 199.99,
          status: 'PROCESSING',
          items: [
            {
              title: 'Gaming Laptop Stand',
              image: '/placeholder.png',
              quantity: 1,
            },
            {
              title: 'RGB Mechanical Keyboard',
              image: '/placeholder.png',
              quantity: 1,
            },
          ],
          estimatedDelivery: '2024-01-25',
        },
      ];
    },
  });

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'processing', label: 'Processing' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const timeFilters = [
    { id: 'last30', label: 'Past 30 days' },
    { id: 'last90', label: 'Past 90 days' },
    { id: 'last365', label: 'Past year' },
    { id: 'all', label: 'All time' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Orders</h1>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search all orders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="card-amazon p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Order Status Filters */}
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSearchParams({ filter: f.id, time: timeFilter })}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${filter === f.id
                    ? 'bg-amazon-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Time Filters */}
          <div className="flex gap-2">
            {timeFilters.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setSearchParams({ filter, time: tf.id })}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium transition-colors
                  ${timeFilter === tf.id
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">
            {filter !== 'all'
              ? `You don't have any ${filter} orders`
              : 'Start shopping to see your orders here'}
          </p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
