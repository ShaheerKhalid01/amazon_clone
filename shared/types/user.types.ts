// User related types

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
export type MembershipTier = 'FREE' | 'PRIME' | 'PRIME_STUDENT' | 'PRIME_BUSINESS';

export interface UserBase {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  membershipTier: MembershipTier;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserBase;
}