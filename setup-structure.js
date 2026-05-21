#!/usr/bin/env node

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
};

// Define all required directories
const DIRECTORIES = [
  // Shared
  'shared/types',
  'shared/constants',
  'shared/enums',

  // Backend
  'backend/src/config',
  'backend/src/common/decorators',
  'backend/src/common/filters',
  'backend/src/common/interceptors',
  'backend/src/common/pipes',
  'backend/src/common/middleware',
  'backend/src/common/guards',
  'backend/src/common/enums',
  'backend/src/modules/auth/dto',
  'backend/src/modules/auth/guards',
  'backend/src/modules/auth/strategies',
  'backend/src/modules/auth/decorators',
  'backend/src/modules/users/dto',
  'backend/src/modules/users/entities',
  'backend/src/modules/products/dto',
  'backend/src/modules/products/entities',
  'backend/src/modules/cart/dto',
  'backend/src/modules/cart/entities',
  'backend/src/modules/orders/dto',
  'backend/src/modules/orders/entities',
  'backend/src/modules/categories/dto',
  'backend/src/modules/categories/entities',
  'backend/src/modules/search',
  'backend/src/modules/reviews/dto',
  'backend/src/modules/wishlist',
  'backend/src/modules/payments/strategies',
  'backend/src/modules/recommendations/algorithms',
  'backend/src/modules/notifications/email',
  'backend/src/modules/notifications/push',
  'backend/src/modules/admin',
  'backend/src/modules/seller',
  'backend/src/database/migrations',
  'backend/src/database/seeds',
  'backend/src/database/factories',
  'backend/src/utils/validators',
  'backend/src/queue/processors',
  'backend/src/queue/consumers',
  'backend/src/cache',
  'backend/test/unit',
  'backend/test/e2e',

  // Frontend
  'frontend/src/components/ui/Button',
  'frontend/src/components/ui/Input',
  'frontend/src/components/ui/Modal',
  'frontend/src/components/ui/Dropdown',
  'frontend/src/components/ui/Tabs',
  'frontend/src/components/ui/Carousel',
  'frontend/src/components/ui/Rating',
  'frontend/src/components/ui/Badge',
  'frontend/src/components/ui/Spinner',
  'frontend/src/components/ui/Tooltip',
  'frontend/src/components/ui/Accordion',
  'frontend/src/components/ui/Toast',
  'frontend/src/components/ui/Pagination',
  'frontend/src/components/layout/Header',
  'frontend/src/components/layout/Footer',
  'frontend/src/components/layout/Sidebar',
  'frontend/src/components/product/ProductCard',
  'frontend/src/components/product/ProductGrid',
  'frontend/src/components/product/ProductImage',
  'frontend/src/components/product/ProductPrice',
  'frontend/src/components/product/ProductRating',
  'frontend/src/components/product/ProductVariants',
  'frontend/src/components/product/ProductSpecs',
  'frontend/src/components/product/ProductReviews',
  'frontend/src/components/cart/CartItem',
  'frontend/src/components/cart/CartSummary',
  'frontend/src/components/cart/CartButton',
  'frontend/src/components/cart/SavedForLater',
  'frontend/src/components/checkout/CheckoutSteps',
  'frontend/src/components/checkout/ShippingAddress',
  'frontend/src/components/checkout/PaymentMethod',
  'frontend/src/components/checkout/OrderReview',
  'frontend/src/components/checkout/PromoCode',
  'frontend/src/components/search/SearchBar',
  'frontend/src/components/search/SearchFilters',
  'frontend/src/components/search/FilterPanel',
  'frontend/src/components/search/SortDropdown',
  'frontend/src/components/order/OrderCard',
  'frontend/src/components/order/OrderDetails',
  'frontend/src/components/order/OrderTracking',
  'frontend/src/components/order/ReturnRequest',
  'frontend/src/components/common/PrimeBadge',
  'frontend/src/components/common/BestSellerBadge',
  'frontend/src/components/common/DeliveryInfo',
  'frontend/src/components/common/QuantitySelector',
  'frontend/src/pages/Home',
  'frontend/src/pages/ProductListing',
  'frontend/src/pages/ProductDetail',
  'frontend/src/pages/Cart',
  'frontend/src/pages/Checkout',
  'frontend/src/pages/Orders',
  'frontend/src/pages/Account',
  'frontend/src/pages/Wishlist',
  'frontend/src/pages/Search',
  'frontend/src/pages/Auth',
  'frontend/src/pages/Deals',
  'frontend/src/pages/Seller',
  'frontend/src/pages/NotFound',
  'frontend/src/hooks',
  'frontend/src/services',
  'frontend/src/store/slices',
  'frontend/src/store/middleware',
  'frontend/src/routes',
  'frontend/src/utils',
  'frontend/src/types',
  'frontend/src/context',
  'frontend/src/assets/images',
  'frontend/src/assets/icons',
  'frontend/src/assets/fonts',
  'frontend/src/styles',
  'frontend/public',
];

// Create directories
function createDirectories() {
  console.log(`${colors.blue}📁 Creating project directories...${colors.reset}\n`);

  let created = 0;
  let existed = 0;

  DIRECTORIES.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`${colors.green}✅ Created:${colors.reset} ${dir}`);
      created++;
    } else {
      console.log(`${colors.yellow}⏭️  Already exists:${colors.reset} ${dir}`);
      existed++;
    }
  });

  console.log(`\n${colors.green}📊 Summary:${colors.reset}`);
  console.log(`   ✅ Created: ${colors.green}${created}${colors.reset} directories`);
  console.log(`   ⏭️  Already existed: ${colors.yellow}${existed}${colors.reset} directories`);
  console.log(`   📦 Total: ${colors.blue}${DIRECTORIES.length}${colors.reset} directories\n`);
}

// Check missing directories
function checkMissing() {
  console.log(`${colors.blue}🔍 Checking for missing directories...${colors.reset}\n`);

  const missing = [];

  DIRECTORIES.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.red}❌ Missing:${colors.reset} ${dir}`);
      missing.push(dir);
    }
  });

  console.log('');

  if (missing.length === 0) {
    console.log(`${colors.green}✅ All ${DIRECTORIES.length} directories are present!${colors.reset}\n`);
  } else {
    console.log(`${colors.red}⚠️  Missing ${missing.length} director${missing.length > 1 ? 'ies' : 'y'}${colors.reset}`);
    console.log(`\n${colors.yellow}Run with 'create' argument to create missing directories:${colors.reset}`);
    console.log(`  node setup-structure.js create\n`);
  }
}

// Main execution
const command = process.argv[2] || 'check';

switch (command) {
  case 'create':
  case 'setup':
  case 'make':
    createDirectories();
    break;
  case 'check':
  case 'verify':
  case 'test':
  default:
    checkMissing();
    break;
}