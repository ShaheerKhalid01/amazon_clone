import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@components/ui/Input/Input';
import Button from '@components/ui/Button/Button';
import { FaPlus, FaHome, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

/**
 * Shipping Address Schema
 */
const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  streetAddress: z.string().min(5, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  addressType: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
  deliveryInstructions: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingAddressProps {
  user: any;
  onSubmit: (data: ShippingFormData) => void;
  initialData?: ShippingFormData | null;
}

/**
 * Shipping Address Component
 */
const ShippingAddress: React.FC<ShippingAddressProps> = ({
  user,
  onSubmit,
  initialData,
}) => {
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: initialData || {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      phoneNumber: user?.phoneNumber || '',
      country: 'United States',
    },
  });

  // Load saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      // TODO: Fetch from API
      const mockAddresses = [
        {
          id: '1',
          fullName: `${user?.firstName} ${user?.lastName}`,
          streetAddress: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          addressType: 'HOME',
        },
      ];
      setSavedAddresses(mockAddresses);
    };

    if (user) {
      loadAddresses();
    }
  }, [user]);

  /**
   * Select saved address
   */
  const selectAddress = (address: any) => {
    setSelectedAddressId(address.id);
    Object.keys(address).forEach(key => {
      setValue(key as any, address[key]);
    });
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit = (data: ShippingFormData) => {
    onSubmit(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        <FaMapMarkerAlt className="inline mr-2 text-amazon-orange" />
        Shipping Address
      </h2>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Addresses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((address) => (
              <button
                key={address.id}
                onClick={() => selectAddress(address)}
                className={`
                  text-left p-4 rounded-lg border-2 transition-all
                  ${selectedAddressId === address.id
                    ? 'border-amazon-orange bg-amazon-orange bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start gap-2">
                  {address.addressType === 'HOME' ? <FaHome className="text-gray-400 mt-1" /> : <FaBuilding className="text-gray-400 mt-1" />}
                  <div>
                    <p className="font-medium text-gray-900">{address.fullName}</p>
                    <p className="text-sm text-gray-600">{address.streetAddress}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* New Address Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          <FaPlus className="inline mr-1" />
          {selectedAddressId ? 'Edit Address' : 'Add New Address'}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />

          <Input
            label="Street Address"
            placeholder="123 Main Street"
            error={errors.streetAddress?.message}
            {...register('streetAddress')}
          />

          <Input
            label="Apartment, suite, etc. (optional)"
            placeholder="Apt 4B"
            error={errors.apartment?.message}
            {...register('apartment')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="New York"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="State"
              placeholder="NY"
              error={errors.state?.message}
              {...register('state')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ZIP Code"
              placeholder="10001"
              error={errors.zipCode?.message}
              {...register('zipCode')}
            />
            <Input
              label="Country"
              placeholder="United States"
              error={errors.country?.message}
              {...register('country')}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="HOME"
                {...register('addressType')}
                className="text-amazon-orange focus:ring-amazon-orange"
              />
              <FaHome className="text-gray-400" />
              <span className="text-sm">Home</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="WORK"
                {...register('addressType')}
                className="text-amazon-orange focus:ring-amazon-orange"
              />
              <FaBuilding className="text-gray-400" />
              <span className="text-sm">Work</span>
            </label>
          </div>

          <Input
            label="Delivery Instructions (optional)"
            placeholder="Leave at the front door"
            error={errors.deliveryInstructions?.message}
            {...register('deliveryInstructions')}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('isDefault')}
              className="w-4 h-4 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
            />
            <span className="text-sm text-gray-700">Save as default address</span>
          </label>

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Continue to Payment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ShippingAddress;
