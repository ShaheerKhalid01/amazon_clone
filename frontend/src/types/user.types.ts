import { UserRole, MembershipTier } from '@shared/enums';

// User related types for frontend

export interface User {
    id: string;
    email: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar?: string;
    role: UserRole;
    membershipTier: MembershipTier;
    defaultAddressId?: string;
    defaultPaymentMethodId?: string;
    isVerified: boolean;
    isTwoFactorEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PaymentMethod {
    id: string;
    type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'UPI' | 'AMAZON_PAY' | 'COD';
    isDefault: boolean;
    cardInfo?: {
      lastFourDigits: string;
      cardType: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
      expiryMonth: number;
      expiryYear: number;
      cardholderName: string;
    };
    upiId?: string;
  }

  export interface LoginCredentials {
    email: string;
    password?: string;
    otp?: string;
    rememberMe?: boolean;
  }

  export interface RegisterData {
    email: string;
    password?: string;
    confirmPassword?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: UserRole;
  }

  export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
