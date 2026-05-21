import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { FaBell, FaCheck, FaTrash, FaEnvelopeOpen } from 'react-icons/fa';
import Spinner from '@components/ui/Spinner/Spinner';

/**
 * Notification Bell Component
 */
const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // TODO: Replace with API call
      return {
        notifications: [
          {
            id: '1',
            type: 'PRICE_DROP',
            title: 'Price Drop Alert!',
            message: 'Wireless Headphones dropped to $79.99',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            link: '/product/1',
          },
          {
            id: '2',
            type: 'ORDER_UPDATE',
            title: 'Order Shipped',
            message: 'Your order #113-8795423 has been shipped',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 120),
            link: '/orders/1',
          },
          {
            id: '3',
            type: 'DEAL_ALERT',
            title: 'Deal of the Day',
            message: 'Check out today\'s exclusive deals',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            link: '/deals',
          },
        ],
        unreadCount: 2,
      };
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // TODO: API call
      console.log('Mark as read:', notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // TODO: API call
      console.log('Mark all as read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      PRICE_DROP: '💰',
      ORDER_UPDATE: '📦',
      DEAL_ALERT: '🔥',
      BACK_IN_STOCK: '📬',
      SHIPPING_UPDATE: '🚚',
      PROMOTIONAL: '🎉',
      SYSTEM: '🔔',
    };
    return icons[type] || '🔔';
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <FaBell className="text-gray-600 text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                         rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-2xl border z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm text-gray-500">({unreadCount} new)</span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                className="text-sm text-amazon-blue hover:underline flex items-center gap-1"
              >
                <FaEnvelopeOpen />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <FaBell className="text-4xl text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification: any) => (
                <Link
                  key={notification.id}
                  to={notification.link || '#'}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsReadMutation.mutate(notification.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b last:border-0
                    ${!notification.isRead ? 'bg-blue-50' : ''}
                  `}
                >
                  <span className="text-2xl flex-shrink-0">
                    {getIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold' : ''} text-gray-900`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-amazon-orange rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <Link
            to="/account/notifications"
            onClick={() => setIsOpen(false)}
            className="block text-center p-3 text-sm text-amazon-blue hover:bg-gray-50 border-t"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
