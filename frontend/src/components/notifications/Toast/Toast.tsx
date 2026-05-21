import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

/**
 * Toast Notification Component
 */
const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 4000,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const config = {
    success: {
      icon: <FaCheckCircle className="text-green-500" />,
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      progress: 'bg-green-500',
    },
    error: {
      icon: <FaTimesCircle className="text-red-500" />,
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      progress: 'bg-red-500',
    },
    warning: {
      icon: <FaExclamationTriangle className="text-yellow-500" />,
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      progress: 'bg-yellow-500',
    },
    info: {
      icon: <FaInfoCircle className="text-blue-500" />,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      progress: 'bg-blue-500',
    },
  };

  const { icon, bg, text, progress } = config[type];

  return (
    <div
      className={`
        ${bg} ${text}
        border rounded-lg shadow-lg p-4 mb-3
        flex items-center gap-3
        transform transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <span className="flex-shrink-0 text-lg">{icon}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(id), 300);
        }}
        className="flex-shrink-0 hover:opacity-70"
      >
        <FaTimes />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${progress} transition-all duration-100`}
          style={{
            width: '100%',
            animation: `shrink ${duration}ms linear`,
          }}
        />
      </div>
    </div>
  );
};

export default Toast;
