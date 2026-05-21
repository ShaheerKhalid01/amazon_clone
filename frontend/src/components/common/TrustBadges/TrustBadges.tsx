import React from 'react';
import { FaShieldAlt, FaUndo, FaMedal, FaStar, FaLock } from 'react-icons/fa';

interface TrustBadgesProps {
  variant?: 'checkout' | 'product' | 'footer';
}

/**
 * Trust Badges Component
 * Displays security and trust indicators
 */
const TrustBadges: React.FC<TrustBadgesProps> = ({ variant = 'checkout' }) => {
  const badges = {
    checkout: [
      { icon: <FaLock />, label: 'Secure Transaction', description: 'Your data is encrypted' },
      { icon: <FaShieldAlt />, label: 'Buyer Protection', description: 'Full refund if item not as described' },
      { icon: <FaUndo />, label: '30-Day Returns', description: 'Easy returns & exchanges' },
    ],
    product: [
      { icon: <FaMedal />, label: 'Quality Guaranteed', description: '100% authentic products' },
      { icon: <FaStar />, label: 'Trusted Seller', description: 'Highly rated seller' },
      { icon: <FaUndo />, label: 'Easy Returns', description: '30-day return window' },
    ],
    footer: [
      { icon: <FaLock />, label: 'Secure Shopping', description: '' },
      { icon: <FaShieldAlt />, label: 'Privacy Protected', description: '' },
      { icon: <FaMedal />, label: 'Trusted by Millions', description: '' },
    ],
  };

  const currentBadges = badges[variant];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {currentBadges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg"
        >
          <span className="text-amazon-orange text-xl flex-shrink-0">
            {badge.icon}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{badge.label}</p>
            {badge.description && (
              <p className="text-xs text-gray-500">{badge.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
