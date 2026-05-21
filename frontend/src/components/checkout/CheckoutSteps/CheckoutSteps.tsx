import React from 'react';
import { FaCheck, FaTruck, FaCreditCard, FaClipboardCheck } from 'react-icons/fa';

interface Step {
  id: string;
  label: string;
  number: number;
}

interface CheckoutStepsProps {
  steps: Step[];
  currentStep: number;
}

/**
 * Checkout Steps Indicator Component
 */
const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ steps, currentStep }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'shipping': return <FaTruck />;
      case 'payment': return <FaCreditCard />;
      case 'review': return <FaClipboardCheck />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300
                  ${index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-amazon-orange text-white ring-4 ring-amazon-orange ring-opacity-30'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index < currentStep ? (
                  <FaCheck />
                ) : (
                  getIcon(step.id)
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium hidden sm:block
                  ${index === currentStep ? 'text-amazon-orange' : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-4 rounded-full transition-all duration-300
                  ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
