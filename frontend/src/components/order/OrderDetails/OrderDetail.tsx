import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '@utils/formatPrice';
import Button from '@components/ui/Button/Button';
import { 
  FaTruck, FaBox, FaCheckCircle, FaMapMarkerAlt, 
  FaCreditCard, FaArrowLeft, FaDownload, FaHeadphones 
} from 'react-icons/fa';

/**
 * Order Detail Page Component
 */
const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock order data
  const order = {
    id: id,
    orderNumber: '113-8795423-9876254',
    date: '2024-01-15',
    status: 'DELIVERED',
    total: 129.99,
    subtotal: 119.99,
    shipping: 0,
    tax: 10.00,
    items: [
      {
        id: '1',
        title: 'Wireless Bluetooth Headphones - Premium Sound Quality with Noise Cancellation',
        brand: 'AudioTech',
        price: 119.99,
        quantity: 1,
        image: '/placeholder.png',
        returnEligible: true,
      },
    ],
    shippingAddress: {
      fullName: 'John Doe',
      streetAddress: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    paymentMethod: {
      type: 'VISA',
      lastFour: '4242',
    },
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    estimatedDelivery: '2024-01-20',
    actualDelivery: '2024-01-19',
  };

  const getStatusStep = () => {
    const steps = [
      { label: 'Ordered', date: 'Jan 15', completed: true },
      { label: 'Shipped', date: 'Jan 17', completed: true },
      { label: 'Out for Delivery', date: 'Jan 19', completed: true },
      { label: 'Delivered', date: 'Jan 19', completed: order.status === 'DELIVERED' },
    ];
    return steps;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-amazon-blue mb-6">
        <FaArrowLeft />
        <span>Back to Orders</span>
      </Link>

      {/* Order Header */}
      <div className="card-amazon p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">Placed on {order.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium flex items-center gap-1">
              <FaCheckCircle />
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="card-amazon p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Delivery Status</h2>
        <div className="relative">
          {getStatusStep().map((step, index) => (
            <div key={index} className="flex items-start gap-4 pb-8 last:pb-0">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {step.completed ? (
                    <FaCheckCircle className="text-white text-sm" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  )}
                </div>
                {index < getStatusStep().length - 1 && (
                  <div className={`absolute top-8 left-4 w-0.5 h-full -translate-x-1/2 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{step.label}</p>
                <p className="text-sm text-gray-500">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
        
        {order.trackingNumber && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <FaTruck className="inline mr-2 text-amazon-orange" />
              Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
              <span className="mx-2">•</span>
              Carrier: <span className="font-medium">{order.carrier}</span>
            </p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="card-amazon p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 hover:text-amazon-blue">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{formatPrice(item.price)}</p>
                {item.returnEligible && (
                  <p className="text-sm text-green-600 mt-1">✓ Eligible for return until Feb 19, 2024</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">Buy Again</Button>
                {item.returnEligible && (
                  <Button variant="secondary" size="sm">Return Item</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="card-amazon p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            <FaMapMarkerAlt className="inline mr-2 text-amazon-orange" />
            Shipping Address
          </h3>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.streetAddress}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card-amazon p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            <FaCreditCard className="inline mr-2 text-amazon-orange" />
            Payment Method
          </h3>
          <div className="text-sm text-gray-600">
            <p>{order.paymentMethod.type} ending in {order.paymentMethod.lastFour}</p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card-amazon p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button variant="outline" size="sm">
          <FaDownload className="mr-2" />
          Download Invoice
        </Button>
        <Button variant="outline" size="sm">
          <FaHeadphones className="mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
