import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@utils/formatPrice';
import Button from '@components/ui/Button/Button';
import { FaChevronDown, FaChevronUp, FaTruck, FaBox, FaCheckCircle } from 'react-icons/fa';

interface OrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    status: string;
    items: Array<{
      title: string;
      image: string;
      quantity: number;
    }>;
    trackingNumber?: string;
    estimatedDelivery?: string;
  };
}

/**
 * Order Card Component
 * Displays individual order information
 */
const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <FaCheckCircle className="text-green-500" />;
      case 'SHIPPED':
        return <FaTruck className="text-blue-500" />;
      case 'PROCESSING':
        return <FaBox className="text-yellow-500" />;
      default:
        return <FaBox className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-50';
      case 'SHIPPED': return 'text-blue-600 bg-blue-50';
      case 'PROCESSING': return 'text-yellow-600 bg-yellow-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="card-amazon overflow-hidden">
      {/* Order Header */}
      <div className="p-4 md:p-6 bg-gray-50 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500">ORDER PLACED</p>
              <p className="text-sm font-medium">{formatDate(order.date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">TOTAL</p>
              <p className="text-sm font-medium">{formatPrice(order.total)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">SHIP TO</p>
              <p className="text-sm font-medium text-amazon-blue hover:underline cursor-pointer">
                John Doe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500">
              ORDER # {order.orderNumber}
            </p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Items */}
          <div className="flex-1">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 hover:text-amazon-blue">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="md:w-48 space-y-2">
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline" size="sm" fullWidth>
                View Order Details
              </Button>
            </Link>
            {order.status === 'DELIVERED' && (
              <Button variant="secondary" size="sm" fullWidth>
                Write a Review
              </Button>
            )}
            {order.trackingNumber && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center gap-1 text-sm text-amazon-blue hover:underline w-full"
              >
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                Track Package
              </button>
            )}
          </div>
        </div>

        {/* Tracking Info (Expandable) */}
        {isExpanded && order.trackingNumber && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <FaTruck className="text-amazon-orange" />
              <span className="font-medium text-sm">Tracking Number: {order.trackingNumber}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Package shipped - Jan 12, 2024</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">In transit - Jan 14, 2024</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-gray-400">Estimated delivery: {order.estimatedDelivery}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
