import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@components/ui/Input/Input';
import Button from '@components/ui/Button/Button';
import { FaCreditCard, FaCcVisa, FaCcMastercard, FaCcAmex, FaArrowLeft, FaLock } from 'react-icons/fa';

/**
 * Payment Schema
 */
const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Card number must be 16 digits')
    .max(19, 'Invalid card number')
    .regex(/^[\d\s-]+$/, 'Only numbers allowed'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Use MM/YY format'),
  cvv: z.string()
    .min(3, 'CVV must be 3-4 digits')
    .max(4, 'CVV must be 3-4 digits')
    .regex(/^\d+$/, 'Only numbers allowed'),
  saveCard: z.boolean().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentMethodProps {
  onSubmit: (data: PaymentFormData) => void;
  onBack: () => void;
  initialData?: PaymentFormData | null;
}

/**
 * Payment Method Component
 */
const PaymentMethod: React.FC<PaymentMethodProps> = ({
  onSubmit,
  onBack,
  initialData,
}) => {
  const [cardType, setCardType] = useState<string>('');
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {},
  });

  const cardNumber = watch('cardNumber', '');

  /**
   * Detect card type from number
   */
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(cleaned)) return 'MASTERCARD';
    if (/^3[47]/.test(cleaned)) return 'AMEX';
    return '';
  };

  React.useEffect(() => {
    setCardType(detectCardType(cardNumber));
  }, [cardNumber]);

  /**
   * Format card number with spaces
   */
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'VISA': return <FaCcVisa className="text-blue-600 text-2xl" />;
      case 'MASTERCARD': return <FaCcMastercard className="text-red-600 text-2xl" />;
      case 'AMEX': return <FaCcAmex className="text-blue-800 text-2xl" />;
      default: return <FaCreditCard className="text-gray-400 text-2xl" />;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        <FaCreditCard className="inline mr-2 text-amazon-orange" />
        Payment Method
      </h2>

      {/* Saved Cards */}
      {savedCards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Cards</h3>
          <div className="space-y-3">
            {savedCards.map((card) => (
              <button
                key={card.id}
                onClick={() => {
                  setSelectedCardId(card.id);
                  setValue('cardNumber', card.lastFour);
                }}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-4
                  ${selectedCardId === card.id
                    ? 'border-amazon-orange bg-amazon-orange bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <FaCcVisa className="text-2xl text-blue-600" />
                <div>
                  <p className="font-medium">•••• {card.lastFour}</p>
                  <p className="text-sm text-gray-500">Expires {card.expiryDate}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Payment Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              error={errors.cardNumber?.message}
              rightIcon={getCardIcon()}
              {...register('cardNumber', {
                onChange: (e) => {
                  e.target.value = formatCardNumber(e.target.value);
                },
              })}
            />
          </div>

          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            error={errors.cardholderName?.message}
            {...register('cardholderName')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              error={errors.expiryDate?.message}
              {...register('expiryDate')}
            />
            <Input
              label="CVV"
              type="password"
              placeholder="123"
              error={errors.cvv?.message}
              {...register('cvv')}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('saveCard')}
              className="w-4 h-4 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
            />
            <span className="text-sm text-gray-700">Save this card for future purchases</span>
          </label>

          {/* Security Notice */}
          <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <FaLock className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              <FaArrowLeft className="mr-2" />
              Back
            </Button>
            <Button type="submit" variant="primary" size="lg" className="flex-1">
              Review Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethod;
