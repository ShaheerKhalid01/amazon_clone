// Checkout related types

import type { DeliveryEstimate } from './product.types';

export interface CheckoutStep {
    id: string;
    label: string;
    isCompleted: boolean;
    isActive: boolean;
  }
  
  export interface ShippingOption {
    id: string;
    carrier: string;
    service: string;
    type: 'STANDARD' | 'EXPEDITED' | 'TWO_DAY' | 'ONE_DAY' | 'SAME_DAY';
    cost: number;
    estimatedDelivery: DeliveryEstimate;
    isAvailable: boolean;
  }
  
  export interface PaymentOption {
    id: string;
    type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'UPI' | 'AMAZON_PAY' | 'COD';
    label: string;
    description: string;
    icon?: string;
    isAvailable: boolean;
    processingFee?: number;
  }
  
  export interface CheckoutState {
    step: number;
    selectedAddressId?: string;
    selectedShippingOptionId?: string;
    selectedPaymentMethodId?: string;
    isGiftOrder: boolean;
    giftMessage?: string;
    promoCode?: string;
    promoDiscount?: number;
    useWallet: boolean;
    walletBalance?: number;
  }
  
  export interface PlaceOrderPayload {
    addressId: string;
    shippingOptionId: string;
    paymentMethodId: string;
    promoCode?: string;
    isGiftOrder: boolean;
    giftMessage?: string;
    useWallet: boolean;
  }
