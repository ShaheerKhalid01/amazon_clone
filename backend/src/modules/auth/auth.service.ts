import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResult, TokenPair } from './interfaces/jwt-payload.interface';

interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  membershipTier: string;
  isActive: boolean;
  password?: string;
}

/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly users = new Map<string, UserInfo>(); // Replace with database repository

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Initialize default admin user for quick testing
    this.users.set('admin@example.com', {
      id: uuidv4(),
      email: 'admin@example.com',
      password: bcrypt.hashSync('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      membershipTier: 'FREE',
      isActive: true,
    });
  }

  /**
   * Authenticate user with email and password
   */
  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password } = loginDto;

    // Find user
    const user = this.users.get(email);
    if (!user) {
      this.logger.warn(`Login failed: User not found - ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      this.logger.warn(`Login failed: Inactive account - ${email}`);
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password - ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    // user.lastLogin = new Date(); // Removed for simplicity in stub
    this.users.set(email, user);

    this.logger.log(`User logged in successfully: ${email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        membershipTier: user.membershipTier,
      },
      tokens,
    };
  }

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResult> {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
      role,
    } = registerDto;

    // Validate passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    if (this.users.has(email)) {
      this.logger.warn(`Registration failed: Email already exists - ${email}`);
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password || '', saltRounds);

    // Create user
    const newUser: UserInfo = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      // phoneNumber: phoneNumber || null,
      role: role || 'CUSTOMER',
      membershipTier: 'FREE',
      isActive: true,
      // isVerified: false,
      // createdAt: new Date(),
      // updatedAt: new Date(),
      // lastLogin: null,
    };

    // Save user
    this.users.set(email, newUser);

    // Generate tokens
    const tokens = await this.generateTokens(newUser);

    this.logger.log(`New user registered: ${email}`);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        membershipTier: newUser.membershipTier,
      },
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      }) as { email: string };

      const user = this.users.get(decoded.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error: any) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user (invalidate tokens)
   */
  async logout(_userId: string, _refreshToken: string): Promise<void> {
    // TODO: Add token to blacklist or remove from whitelist
    this.logger.log(`User logged out: ${_userId}`);
  }

  /**
   * Generate access and refresh token pair
   */
  private async generateTokens(user: UserInfo): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn:
          (this.configService.get<string>('jwt.expiresIn') as any) || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn:
          (this.configService.get<string>('jwt.refreshExpiresIn') as any) ||
          '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /**
   * Validate user by ID
   */
  async validateUserById(userId: string): Promise<any> {
    const user = Array.from(this.users.values()).find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }
}
