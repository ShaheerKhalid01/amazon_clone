import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/ui/Button/Button';
import { 
  FaUser, FaBox, FaHeart, FaMapMarkerAlt, FaCreditCard, 
  FaBell, FaShieldAlt, FaSignOutAlt, FaChevronRight,
  FaUserCircle, FaStar, FaClock
} from 'react-icons/fa';

/**
 * Account Page Component
 * User dashboard with navigation
 */
const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      section: 'Account Settings',
      items: [
        { id: 'profile', label: 'Profile Information', icon: <FaUser />, path: '/account' },
        { id: 'addresses', label: 'Addresses', icon: <FaMapMarkerAlt />, path: '/account/addresses' },
        { id: 'payment', label: 'Payment Methods', icon: <FaCreditCard />, path: '/account/payments' },
        { id: 'notifications', label: 'Notifications', icon: <FaBell />, path: '/account/notifications' },
        { id: 'security', label: 'Login & Security', icon: <FaShieldAlt />, path: '/account/security' },
      ],
    },
    {
      section: 'Orders & Shopping',
      items: [
        { id: 'orders', label: 'Your Orders', icon: <FaBox />, path: '/orders' },
        { id: 'wishlist', label: 'Wishlist', icon: <FaHeart />, path: '/wishlist' },
        { id: 'reviews', label: 'Your Reviews', icon: <FaStar />, path: '/account/reviews' },
      ],
    },
  ];

  const quickStats = [
    { label: 'Total Orders', value: '12', icon: <FaBox className="text-amazon-orange" /> },
    { label: 'Wishlist Items', value: '5', icon: <FaHeart className="text-red-500" /> },
    { label: 'Reviews', value: '3', icon: <FaStar className="text-yellow-500" /> },
    { label: 'Member Since', value: '2024', icon: <FaClock className="text-green-500" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amazon-orange bg-opacity-10 rounded-full flex items-center justify-center">
            <FaUserCircle className="text-4xl text-amazon-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {user?.firstName || 'User'}
            </h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat) => (
          <div key={stat.label} className="card-amazon p-4 text-center">
            <div className="text-2xl mb-2 flex justify-center">{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          {menuItems.map((section) => (
            <div key={section.section} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors
                      ${location.pathname === item.path
                        ? 'bg-amazon-orange bg-opacity-10 text-amazon-orange font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    <FaChevronRight className="ml-auto text-gray-400 text-xs" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <div className="mt-6 px-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Profile Section (Default) */}
          {location.pathname === '/account' && (
            <div className="card-amazon p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue={user?.firstName}
                      className="input-amazon"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue={user?.lastName}
                      className="input-amazon"
                      readOnly
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="input-amazon bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={user?.phoneNumber || ''}
                    className="input-amazon"
                    placeholder="Add phone number"
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="primary">Save Changes</Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
              </div>
            </div>
          )}

          {/* Prime Membership Banner */}
          <div className="mt-6 bg-gradient-to-r from-amazon-blue to-blue-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Try Amazon Prime</h3>
                <p className="text-blue-100">Get FREE shipping, exclusive deals, and more!</p>
              </div>
              <Button variant="primary" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
