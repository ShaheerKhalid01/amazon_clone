const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Helper function to create file with content
function createFile(filePath, content, description = '') {
  const dir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create file
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`${colors.green}✅ Created:${colors.reset} ${filePath} ${description ? `(${description})` : ''}`);
}

// Helper function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

console.log(`${colors.cyan}📁 Generating Amazon Clone project files...${colors.reset}\n`);

// ============================================
// ROOT FILES
// ============================================

// Root .gitignore
createFile('.gitignore', `
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage
coverage/
*.lcov
.nyc_output

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.swp
*.swo

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Uploads
uploads/*
!uploads/.gitkeep

# Docker
docker-compose.override.yml

# Temporary
tmp/
temp/
*.tmp
*.tsbuildinfo
`, 'Root Git ignore file');

// README.md
createFile('README.md', `
# Amazon Clone - Full Stack E-commerce Application

A full-featured Amazon clone built with NestJS, React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL/MySQL** - Database
- **TypeORM** - ORM
- **Redis** - Caching
- **JWT** - Authentication
- **Swagger** - API Documentation
- **Bull** - Job Queue
- **Stripe** - Payment Processing

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State Management
- **React Query** - Server State
- **React Router** - Routing
- **Axios** - HTTP Client

## 📁 Project Structure

\`\`\`
amazon-clone/
├── backend/          # NestJS Backend
├── frontend/         # React Frontend
├── shared/           # Shared types & constants
└── package.json      # Root package.json
\`\`\`

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL/MySQL

### Installation

\`\`\`bash
# Install all dependencies
npm run setup

# Start development servers
npm run dev
\`\`\`

### Environment Variables

Copy \`.env.example\` to \`.env\` in both backend and frontend directories and update the values.

## 📜 Available Scripts

\`\`\`bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start only backend
npm run dev:frontend     # Start only frontend

# Building
npm run build            # Build both
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend

# Testing
npm run test            # Run all tests

# Maintenance
npm run clean           # Remove node_modules
npm run setup           # Fresh install
\`\`\`

## 🔗 API Documentation

Once the backend is running, visit: http://localhost:5000/api/docs

## 📝 License

MIT
`, 'Project README');

// ============================================
// SHARED FILES
// ============================================

// Shared package.json
createFile('shared/package.json', JSON.stringify({
  name: "@amazon-clone/shared",
  version: "1.0.0",
  main: "index.ts",
  types: "index.ts",
  scripts: {},
}, null, 2), 'Shared package.json');

// Shared index
createFile('shared/index.ts', `
export * from './types';
export * from './constants';
export * from './enums';
`, 'Shared barrel export');

// Shared types
createFile('shared/types/index.ts', `
export * from './common.types';
export * from './product.types';
export * from './user.types';
export * from './order.types';
`, 'Shared types barrel');

createFile('shared/types/common.types.ts', `
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface Image {
  id: string;
  url: string;
  thumbnailUrl: string;
  altText: string;
}

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  addressType: 'HOME' | 'WORK' | 'OTHER';
}
`, 'Shared common types');

createFile('shared/types/product.types.ts', `
export type ProductCategory = 
  | 'ELECTRONICS'
  | 'FASHION'
  | 'HOME_KITCHEN'
  | 'BOOKS'
  | 'SPORTS_OUTDOORS';

export type ProductCondition = 
  | 'NEW'
  | 'RENEWED'
  | 'USED';

export type ProductAvailability = 
  | 'IN_STOCK'
  | 'OUT_OF_STOCK'
  | 'PRE_ORDER';

export interface PricingInfo {
  basePrice: number;
  salePrice?: number;
  isOnSale: boolean;
  currency: string;
}

export interface ProductBase {
  id: string;
  title: string;
  brand: string;
  description: string;
  category: ProductCategory;
  pricing: PricingInfo;
  condition: ProductCondition;
  availability: ProductAvailability;
}
`, 'Shared product types');

createFile('shared/types/user.types.ts', `
export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';
export type MembershipTier = 'FREE' | 'PRIME' | 'PRIME_STUDENT';

export interface UserBase {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  membershipTier: MembershipTier;
}
`, 'Shared user types');

createFile('shared/types/order.types.ts', `
export type OrderStatus = 
  | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export interface OrderBase {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  currency: string;
}
`, 'Shared order types');

// Shared constants
createFile('shared/constants/index.ts', `
export const APP_NAME = 'Amazon Clone';
export const API_VERSION = 'v1';
export const DEFAULT_CURRENCY = 'USD';
export const ITEMS_PER_PAGE = 20;
export const MAX_CART_ITEMS = 50;
`, 'Shared constants');

// Shared enums
createFile('shared/enums/index.ts', `
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  NET_BANKING = 'NET_BANKING',
  UPI = 'UPI',
  AMAZON_PAY = 'AMAZON_PAY',
  COD = 'COD',
}

export enum ShippingSpeed {
  STANDARD = 'STANDARD',
  EXPEDITED = 'EXPEDITED',
  TWO_DAY = 'TWO_DAY',
  ONE_DAY = 'ONE_DAY',
  SAME_DAY = 'SAME_DAY',
}
`, 'Shared enums');

// ============================================
// BACKEND FILES
// ============================================

// Backend .env.example
createFile('backend/.env.example', `
# Application
NODE_ENV=development
PORT=5000
APP_NAME=Amazon Clone API
APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=amazon_clone

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
`, 'Backend environment example');

// Backend config files
createFile('backend/src/config/app.config.ts', `
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  name: process.env.APP_NAME || 'Amazon Clone API',
  url: process.env.APP_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
`, 'Backend app config');

createFile('backend/src/config/database.config.ts', `
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'amazon_clone',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
}));
`, 'Backend database config');

createFile('backend/src/config/jwt.config.ts', `
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'super-secret-key',
  expiresIn: process.env.JWT_EXPIRATION || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
`, 'Backend JWT config');

createFile('backend/src/config/redis.config.ts', `
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
}));
`, 'Backend Redis config');

// Backend common files
createFile('backend/src/common/decorators/current-user.decorator.ts', `
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
`, 'Current user decorator');

createFile('backend/src/common/decorators/roles.decorator.ts', `
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../shared/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
`, 'Roles decorator');

createFile('backend/src/common/filters/http-exception.filter.ts', `
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    this.logger.error(
      \`HTTP Status: \${status} Error Message: \${JSON.stringify(message)}\`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
`, 'HTTP exception filter');

createFile('backend/src/common/interceptors/transform.interceptor.ts', `
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
`, 'Transform interceptor');

createFile('backend/src/common/pipes/validation.pipe.ts', `
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
`, 'Validation pipe');

createFile('backend/src/common/middleware/logger.middleware.ts', `
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        \`\${method} \${originalUrl} \${statusCode} \${contentLength || 0} - \${responseTime}ms - \${userAgent} \${ip}\`,
      );
    });

    next();
  }
}
`, 'Logger middleware');

// Backend modules - Auth
createFile('backend/src/modules/auth/auth.module.ts', `
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRATION') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
`, 'Auth module');

createFile('backend/src/modules/auth/auth.service.ts', `
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }
}
`, 'Auth service');

createFile('backend/src/modules/auth/auth.controller.ts', `
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
`, 'Auth controller');

createFile('backend/src/modules/auth/dto/login.dto.ts', `
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}
`, 'Login DTO');

createFile('backend/src/modules/auth/dto/register.dto.ts', `
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
`, 'Register DTO');

createFile('backend/src/modules/auth/guards/jwt-auth.guard.ts', `
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
`, 'JWT Auth Guard');

createFile('backend/src/modules/auth/strategies/jwt.strategy.ts', `
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
`, 'JWT Strategy');

// Backend modules - Users
createFile('backend/src/modules/users/users.module.ts', `
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
`, 'Users module');

createFile('backend/src/modules/users/users.service.ts', `
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  async findByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string) {
    return this.users.find(user => user.id === id);
  }

  async create(userData: any) {
    const user = {
      id: Date.now().toString(),
      ...userData,
      role: userData.role || 'CUSTOMER',
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}
`, 'Users service');

createFile('backend/src/modules/users/users.controller.ts', `
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }
}
`, 'Users controller');

// Backend modules - Products
createFile('backend/src/modules/products/products.module.ts', `
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
`, 'Products module');

createFile('backend/src/modules/products/products.service.ts', `
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private products = [];

  async findAll(query: any) {
    return {
      items: this.products,
      total: this.products.length,
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }

  async findById(id: string) {
    return this.products.find(product => product.id === id);
  }

  async create(productData: any) {
    const product = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  async update(id: string, productData: any) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...productData };
    }
    return this.products[index];
  }

  async delete(id: string) {
    this.products = this.products.filter(p => p.id !== id);
  }
}
`, 'Products service');

createFile('backend/src/modules/products/products.controller.ts', `
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products' })
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() productData: any) {
    return this.productsService.create(productData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  async update(@Param('id') id: string, @Body() productData: any) {
    return this.productsService.update(id, productData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
`, 'Products controller');

// Backend modules - Cart
createFile('backend/src/modules/cart/cart.module.ts', `
import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
`, 'Cart module');

createFile('backend/src/modules/cart/cart.service.ts', `
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  private carts = new Map();

  async getCart(userId: string) {
    return this.carts.get(userId) || { items: [], total: 0 };
  }

  async addToCart(userId: string, item: any) {
    const cart = await this.getCart(userId);
    const existingItem = cart.items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    
    cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    this.carts.set(userId, cart);
    
    return cart;
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    this.carts.set(userId, cart);
    return cart;
  }

  async clearCart(userId: string) {
    this.carts.delete(userId);
  }
}
`, 'Cart service');

createFile('backend/src/modules/cart/cart.controller.ts', `
import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(@CurrentUser('id') userId: string, @Body() item: any) {
    return this.cartService.addToCart(userId, item);
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeFromCart(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }
}
`, 'Cart controller');

// Backend modules - Orders
createFile('backend/src/modules/orders/orders.module.ts', `
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
`, 'Orders module');

createFile('backend/src/modules/orders/orders.service.ts', `
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private orders = [];

  async findAll(userId: string) {
    return this.orders.filter(order => order.userId === userId);
  }

  async findById(id: string) {
    return this.orders.find(order => order.id === id);
  }

  async create(userId: string, orderData: any) {
    const order = {
      id: Date.now().toString(),
      userId,
      ...orderData,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      createdAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findById(id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
    }
    return order;
  }
}
`, 'Orders service');

createFile('backend/src/modules/orders/orders.controller.ts', `
import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@CurrentUser('id') userId: string, @Body() orderData: any) {
    return this.ordersService.create(userId, orderData);
  }
}
`, 'Orders controller');

// Backend modules - Categories
createFile('backend/src/modules/categories/categories.module.ts', `
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
`, 'Categories module');

createFile('backend/src/modules/categories/categories.service.ts', `
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  private categories = [
    { id: '1', name: 'Electronics', slug: 'electronics', parentId: null },
    { id: '2', name: 'Fashion', slug: 'fashion', parentId: null },
    { id: '3', name: 'Home & Kitchen', slug: 'home-kitchen', parentId: null },
    { id: '4', name: 'Books', slug: 'books', parentId: null },
    { id: '5', name: 'Sports & Outdoors', slug: 'sports-outdoors', parentId: null },
  ];

  async findAll() {
    return this.categories;
  }

  async findById(id: string) {
    return this.categories.find(cat => cat.id === id);
  }

  async findSubcategories(parentId: string) {
    return this.categories.filter(cat => cat.parentId === parentId);
  }
}
`, 'Categories service');

createFile('backend/src/modules/categories/categories.controller.ts', `
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Get(':id/subcategories')
  @ApiOperation({ summary: 'Get subcategories' })
  async findSubcategories(@Param('id') id: string) {
    return this.categoriesService.findSubcategories(id);
  }
}
`, 'Categories controller');

// Backend modules - Search
createFile('backend/src/modules/search/search.module.ts', `
import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
`, 'Search module');

createFile('backend/src/modules/search/search.service.ts', `
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  async search(query: string, filters: any) {
    return {
      products: [],
      totalResults: 0,
      currentPage: filters.page || 1,
      totalPages: 0,
      relatedSearches: [],
    };
  }
}
`, 'Search service');

createFile('backend/src/modules/search/search.controller.ts', `
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search products' })
  async search(
    @Query('q') query: string,
    @Query() filters: any,
  ) {
    return this.searchService.search(query, filters);
  }
}
`, 'Search controller');

// Backend main.ts (updated)
createFile('backend/src/main.ts', `
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Amazon Clone API')
    .setDescription('Full-featured Amazon Clone REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('products')
    .addTag('users')
    .addTag('orders')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(\`🚀 Application running on: http://localhost:\${port}\`);
  console.log(\`📚 API Documentation: http://localhost:\${port}/api/docs\`);
}
bootstrap();
`, 'Backend main entry point');

// ============================================
// FRONTEND FILES
// ============================================

// Frontend .env.example
createFile('frontend/.env.example', `
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Amazon Clone
VITE_APP_ENV=development
VITE_STRIPE_PUBLIC_KEY=
`, 'Frontend environment example');

// Frontend services
createFile('frontend/src/services/api.ts', `
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = \`Bearer \${token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    return this.api.get(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.api.post(url, data);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.api.put(url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.api.delete(url);
  }
}

export const apiService = new ApiService();
export default apiService;
`, 'API service');

// Frontend services for specific features
createFile('frontend/src/services/auth.service.ts', `
import apiService from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/user.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await apiService.post<User>('/auth/register', data);
    return response;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
export default authService;
`, 'Auth service');

createFile('frontend/src/services/product.service.ts', `
import apiService from './api';
import type { Product, ProductListing, ProductFilters } from '../types/product.types';

class ProductService {
  async getProducts(filters?: ProductFilters): Promise<ProductListing[]> {
    const response = await apiService.get<ProductListing[]>('/products', filters);
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await apiService.get<Product>(\`/products/\${id}\`);
    return response.data;
  }

  async getProductsByCategory(category: string): Promise<ProductListing[]> {
    const response = await apiService.get<ProductListing[]>('/products', { category });
    return response.data;
  }

  async searchProducts(query: string): Promise<ProductListing[]> {
    const response = await apiService.get<ProductListing[]>('/search', { q: query });
    return response.data;
  }
}

export const productService = new ProductService();
export default productService;
`, 'Product service');

createFile('frontend/src/services/cart.service.ts', `
import apiService from './api';
import type { Cart, AddToCartPayload } from '../types/cart.types';

class CartService {
  async getCart(): Promise<Cart> {
    const response = await apiService.get<Cart>('/cart');
    return response.data;
  }

  async addToCart(payload: AddToCartPayload): Promise<Cart> {
    const response = await apiService.post<Cart>('/cart/add', payload);
    return response.data;
  }

  async removeFromCart(productId: string): Promise<void> {
    await apiService.delete(\`/cart/remove/\${productId}\`);
  }

  async updateQuantity(productId: string, quantity: number): Promise<Cart> {
    const response = await apiService.put<Cart>('/cart/update', { productId, quantity });
    return response.data;
  }
}

export const cartService = new CartService();
export default cartService;
`, 'Cart service');

// Frontend hooks
createFile('frontend/src/hooks/useAuth.ts', `
import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types/user.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
`, 'useAuth hook');

createFile('frontend/src/hooks/useProduct.ts', `
import { useState, useEffect } from 'react';
import { productService } from '../services/product.service';
import type { Product } from '../types/product.types';

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error };
}
`, 'useProduct hook');

// Frontend store
createFile('frontend/src/store/index.ts', `
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`, 'Redux store');

createFile('frontend/src/store/slices/authSlice.ts', `
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
`, 'Auth slice');

createFile('frontend/src/store/slices/cartSlice.ts', `
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartItem } from '../../types/cart.types';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.loading = false;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      if (state.cart) {
        state.cart.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(
          item => item.productId !== action.payload
        );
      }
    },
    clearCart: (state) => {
      state.cart = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCart, addItem, removeItem, clearCart, setLoading } = cartSlice.actions;
export default cartSlice.reducer;
`, 'Cart slice');

createFile('frontend/src/store/slices/uiSlice.ts', `
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  searchOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: false,
  searchOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, toggleSearch, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
`, 'UI slice');

// Frontend components
createFile('frontend/src/components/ui/Button/Button.tsx', `
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-amazon-orange hover:bg-amazon-orange-dark text-white focus:ring-amazon-orange',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    outline: 'border-2 border-amazon-orange text-amazon-orange hover:bg-amazon-orange hover:text-white focus:ring-amazon-orange',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className} \${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }\`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
`, 'Button component');

createFile('frontend/src/components/layout/Header/Header.tsx', `
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-amazon-navy text-white">
      <div className="flex items-center px-4 py-2 max-w-amazon mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center mr-4">
          <span className="text-2xl font-bold">amazon</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-4">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Amazon..."
              className="w-full px-4 py-2 text-gray-900 rounded-l-md focus:outline-none"
            />
            <button className="bg-amazon-orange hover:bg-amazon-orange-dark px-4 rounded-r-md">
              🔍
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link to="/login" className="hover:text-amazon-orange">
            <div className="text-xs">Hello, Sign in</div>
            <div className="font-bold">Account & Lists</div>
          </Link>
          
          <Link to="/orders" className="hover:text-amazon-orange">
            <div className="text-xs">Returns</div>
            <div className="font-bold">& Orders</div>
          </Link>

          <Link to="/cart" className="hover:text-amazon-orange flex items-center">
            <span className="text-2xl">🛒</span>
            <span className="font-bold">Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
`, 'Header component');

createFile('frontend/src/components/layout/Footer/Footer.tsx', `
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amazon-navy text-white mt-8">
      <div className="max-w-amazon mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Get to Know Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press Releases</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Connect with Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/facebook">Facebook</Link></li>
              <li><Link to="/twitter">Twitter</Link></li>
              <li><Link to="/instagram">Instagram</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Make Money with Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/sell">Sell on Amazon</Link></li>
              <li><Link to="/affiliate">Become an Affiliate</Link></li>
              <li><Link to="/advertise">Advertise Your Products</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Let Us Help You</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/account">Your Account</Link></li>
              <li><Link to="/orders">Your Orders</Link></li>
              <li><Link to="/help">Help & Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 Amazon Clone. All rights reserved. This is a demo project.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
`, 'Footer component');

createFile('frontend/src/components/layout/Layout.tsx', `
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
`, 'Layout component');

// Frontend pages
createFile('frontend/src/pages/Home/Home.tsx', `
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const categories = [
    { name: 'Electronics', icon: '🖥️', slug: 'electronics' },
    { name: 'Fashion', icon: '👗', slug: 'fashion' },
    { name: 'Home & Kitchen', icon: '🏠', slug: 'home-kitchen' },
    { name: 'Books', icon: '📚', slug: 'books' },
    { name: 'Sports', icon: '⚽', slug: 'sports' },
    { name: 'Beauty', icon: '💄', slug: 'beauty' },
    { name: 'Toys', icon: '🧸', slug: 'toys' },
    { name: 'Automotive', icon: '🚗', slug: 'automotive' },
  ];

  return (
    <div className="max-w-amazon mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amazon-navy to-amazon-dark-gray text-white p-12 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Amazon Clone</h1>
        <p className="text-xl mb-8">Discover millions of products at great prices</p>
        <Link
          to="/products"
          className="bg-amazon-orange hover:bg-amazon-orange-dark text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
        >
          Shop Now
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={\`/products?category=\${category.slug}\`}
              className="amazon-card p-6 text-center hover:scale-105 transform transition-transform"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Deals Section */}
      <div className="mt-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Today's Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="amazon-card p-4">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="font-semibold mb-2">Product {item}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-amazon-red text-lg font-bold">\$99.99</span>
                <span className="text-gray-500 line-through">\$149.99</span>
                <span className="text-amazon-green text-sm">33% off</span>
              </div>
              <div className="mt-2">
                <span className="text-yellow-400">★★★★</span>
                <span className="text-sm text-gray-500 ml-2">(1,234)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
`, 'Home page');

createFile('frontend/src/pages/Auth/Login.tsx', `
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="amazon-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="amazon-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="amazon-button w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          New to Amazon?{' '}
          <Link to="/register" className="amazon-link">
            Create your account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
`, 'Login page');

createFile('frontend/src/pages/NotFound/NotFound.tsx', `
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="amazon-button">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
`, '404 Not Found page');

// Frontend routes
createFile('frontend/src/routes/ProtectedRoute.tsx', `
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-orange"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
`, 'Protected route component');

// Frontend styles
createFile('frontend/src/styles/globals.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    @apply bg-gray-100 text-gray-900;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  .amazon-button {
    @apply bg-amazon-orange hover:bg-amazon-orange-dark text-white font-medium 
           py-2 px-6 rounded-full transition-colors duration-200 focus:outline-none 
           focus:ring-2 focus:ring-offset-2 focus:ring-amazon-orange;
  }

  .amazon-link {
    @apply text-amazon-blue hover:text-amazon-blue-dark hover:underline 
           cursor-pointer transition-colors duration-200;
  }

  .amazon-input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-md 
           focus:outline-none focus:ring-2 focus:ring-amazon-orange 
           focus:border-transparent transition-all duration-200;
  }

  .amazon-card {
    @apply bg-white rounded-lg shadow-sm hover:shadow-md 
           transition-all duration-200;
  }
}
`, 'Global styles');

// Summary log
console.log(`\n${colors.cyan}📊 File Generation Summary:${colors.reset}`);
console.log(`${colors.green}✅ All essential files have been created successfully!${colors.reset}`);
console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
console.log(`  1. Run: ${colors.blue}npm run install:all${colors.reset}`);
console.log(`  2. Run: ${colors.blue}npm run dev${colors.reset}`);
console.log(`  3. Open: ${colors.blue}http://localhost:5173${colors.reset}\n`);