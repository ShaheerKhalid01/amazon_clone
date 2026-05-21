import React from 'react';
import { FaTruck, FaBox, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
}

interface OrderTrackingProps {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
}

/**
 * Order Tracking Component
 */
const OrderTracking: React.FC<OrderTrackingProps> = ({
  trackingNumber,
  carrier,
  estimatedDelivery,
  events = [],
}) => {
  return (
    <div className="card-amazon p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Package Tracking</h3>
        <div className="text-sm text-gray-500">
          <span className="font-medium">{carrier}</span> • {trackingNumber}
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="relative">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4 pb-6 last:pb-0">
            {/* Timeline Line */}
            <div className="relative flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              {index < events.length - 1 && (
                <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
              )}
            </div>

            {/* Event Content */}
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{event.status}</p>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{event.date}</p>
                  <p>{event.time}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estimated Delivery */}
      <div className="mt-6 p-4 bg-amazon-orange bg-opacity-10 rounded-lg">
        <div className="flex items-center gap-3">
          <FaTruck className="text-amazon-orange text-xl" />
          <div>
            <p className="font-medium text-gray-900">Estimated Delivery</p>
            <p className="text-sm text-gray-600">{estimatedDelivery}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
