import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

/**
 * Swagger Configuration
 * Sets up API documentation with comprehensive details
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Amazon Clone API')
    .setDescription(
      `
      # Amazon Clone - Full-Featured E-Commerce API
      
      ## Overview
      A complete REST API for an Amazon-like e-commerce platform built with NestJS.
      
      ## Features
      - 🔐 **Authentication** - JWT-based auth with refresh tokens
      - 👤 **User Management** - Profiles, addresses, payment methods
      - 📦 **Product Catalog** - Products, variants, categories
      - 🛒 **Shopping Cart** - Real-time cart management
      - 📋 **Order Processing** - Complete order lifecycle
      - ⭐ **Reviews & Ratings** - Product reviews system
      - 💝 **Wishlist** - Save items for later
      - 🔍 **Search** - Full-text search with filters
      - 🎯 **Recommendations** - Personalized product recommendations
      - 🔔 **Notifications** - Email and push notifications
      - 📊 **Analytics** - Sales and performance tracking
      
      ## Authentication
      Most endpoints require a valid JWT token in the Authorization header:
      \`\`\`
      Authorization: Bearer <your-token>
      \`\`\`
      
      ## Rate Limiting
      - Short: 3 requests per second
      - Medium: 20 requests per 10 seconds
      - Long: 100 requests per minute
      
      ## Error Codes
      - 200: Success
      - 201: Created
      - 400: Bad Request
      - 401: Unauthorized
      - 403: Forbidden
      - 404: Not Found
      - 409: Conflict
      - 429: Too Many Requests
      - 500: Internal Server Error
      
      ## Pagination
      List endpoints support pagination with \`page\` and \`limit\` query parameters.
    `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Amazon Clone Team',
      'https://amazon-clone.com',
      'support@amazonclone.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:5000', 'Development')
    .addServer('https://api.amazonclone.com', 'Production')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API key for external services',
      },
      'api-key',
    )
    .addTag('Health', 'Health check endpoints')
    .addTag('Auth', 'Authentication & authorization')
    .addTag('Users', 'User management & profiles')
    .addTag('Products', 'Product catalog & management')
    .addTag('Categories', 'Category hierarchy')
    .addTag('Cart', 'Shopping cart operations')
    .addTag('Orders', 'Order processing & tracking')
    .addTag('Search', 'Search & filtering')
    .addTag('Reviews', 'Product reviews & ratings')
    .addTag('Wishlist', 'Wishlist management')
    .addTag('Payments', 'Payment processing')
    .addTag('Recommendations', 'Product recommendations')
    .addTag('Notifications', 'User notifications')
    .addTag('Seller', 'Seller portal')
    .addTag('Admin', 'Admin dashboard')
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
      tryItOutEnabled: true,
      defaultModelsExpandDepth: -1,
      displayRequestDuration: true,
    },
    customSiteTitle: 'Amazon Clone API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { background-color: #232F3E; }
      .swagger-ui .topbar .download-url-wrapper .select-label { color: white; }
      .swagger-ui .info .title { color: #FF9900; font-size: 2.5em; }
      .swagger-ui .scheme-container { background-color: #f8f9fa; }
      .swagger-ui .btn.authorize { background-color: #FF9900; border-color: #FF9900; color: white; }
      .swagger-ui .btn.authorize:hover { background-color: #E88B00; }
    `,
    customJs: `
      console.log('Amazon Clone API Documentation Loaded');
    `,
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, customOptions);
}
