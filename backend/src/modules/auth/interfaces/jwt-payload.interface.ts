/**
 * JWT Payload interface
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string; // User email
  role: string; // User role
  iat?: number; // Issued at
  exp?: number; // Expiration
}

/**
 * JWT Token pair interface
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Authentication result interface
 */
export interface AuthResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    membershipTier: string;
  };
  tokens: TokenPair;
}
