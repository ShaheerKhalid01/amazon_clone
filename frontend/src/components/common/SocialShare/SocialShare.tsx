import React from 'react';
import { FaFacebook, FaTwitter, FaPinterest, FaLink, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
}

/**
 * Social Share Component
 */
const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = 'Check this out on Amazon Clone!',
  description = '',
  image = '',
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Pinterest',
      icon: <FaPinterest />,
      color: 'bg-red-600 hover:bg-red-700',
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: <FaEnvelope />,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-2">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${link.color} text-white p-2 rounded-full transition-colors`}
          title={`Share on ${link.name}`}
        >
          <span className="text-sm">{link.icon}</span>
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
        title="Copy link"
      >
        <FaLink className="text-gray-600 text-sm" />
      </button>
    </div>
  );
};

export default SocialShare;
