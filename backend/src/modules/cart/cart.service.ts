import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItemData } from './entities/cart.entity';
import {
  AddToCartDto,
  UpdateCartItemDto,
  ApplyCouponDto,
} from './dto/cart.dto';
import { ProductsService } from '../products/products.service';

/**
 * Cart Service
 * Manages shopping cart operations
 */
@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Get or create user cart
   */
  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        items: [],
        subtotal: 0,
        total: 0,
        totalSavings: 0,
        itemCount: 0,
        couponDiscount: 0,
      });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  /**
   * Add item to cart
   */
  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const cart = await this.getCart(userId);
    const { productId, variantId, quantity, isGift, giftMessage } =
      addToCartDto;

    // Validate product exists and is available
    const product = await this.productsService.findById(productId);

    if (product.availability === 'OUT_OF_STOCK') {
      throw new BadRequestException('Product is out of stock');
    }

    // Get price (variant or base)
    let price = product.basePrice;
    let compareAtPrice = product.compareAtPrice;
    let variantSku = '';
    let variantOptions: Record<string, string> = {};

    if (variantId) {
      const variant = product.variants?.find((v) => v.id === variantId);
      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }
      price = variant.price;
      compareAtPrice = variant.compareAtPrice;
      variantSku = variant.sku;
      variantOptions = variant.optionValues;
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.variantId === variantId,
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice =
        cart.items[existingItemIndex].quantity * price;
    } else {
      // Add new item
      const newItem: CartItemData = {
        productId,
        asin: product.asin,
        title: product.title,
        brand: product.brand,
        variantId,
        variantSku,
        variantOptions,
        quantity,
        unitPrice: price,
        totalPrice: price * quantity,
        compareAtPrice,
        image: product.images?.[0]?.url || '',
        isGift: isGift || false,
        giftMessage: giftMessage || '',
        isPrimeEligible: product.isPrimeEligible,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        addedAt: new Date(),
        inStock: product.availability === 'IN_STOCK',
        maxQuantity: Math.min(product.totalQuantity, 50),
      };

      cart.items.push(newItem);
    }

    // Recalculate cart totals
    await this.recalculateCart(cart);

    const savedCart = await this.cartRepository.save(cart);
    this.logger.log(`Item added to cart for user: ${userId}`);

    return savedCart;
  }

  /**
   * Update cart item
   */
  async updateCartItem(
    userId: string,
    updateDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getCart(userId);
    const { productId, quantity, isGift, giftMessage } = updateDto;

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    const item = cart.items[itemIndex];

    // If quantity is 0, remove item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      if (quantity !== undefined) {
        item.quantity = quantity;
        item.totalPrice = item.unitPrice * quantity;
      }
      if (isGift !== undefined) {
        item.isGift = isGift;
      }
      if (giftMessage !== undefined) {
        item.giftMessage = giftMessage;
      }
    }

    await this.recalculateCart(cart);
    return this.cartRepository.save(cart);
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(userId);

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await this.recalculateCart(cart);
    return this.cartRepository.save(cart);
  }

  /**
   * Clear cart
   */
  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;
    cart.totalSavings = 0;
    cart.itemCount = 0;
    cart.couponDiscount = 0;
    cart.couponCode = undefined;
    await this.cartRepository.save(cart);
  }

  /**
   * Apply coupon to cart
   */
  async applyCoupon(userId: string, couponDto: ApplyCouponDto): Promise<Cart> {
    const cart = await this.getCart(userId);

    // Mock coupon validation (replace with real logic)
    const validCoupons: Record<
      string,
      { discount: number; type: 'percentage' | 'fixed' }
    > = {
      SAVE10: { discount: 10, type: 'percentage' },
      SAVE20: { discount: 20, type: 'percentage' },
      FLAT50: { discount: 50, type: 'fixed' },
    };

    const coupon = validCoupons[couponDto.code.toUpperCase()];

    if (!coupon) {
      throw new BadRequestException('Invalid or expired coupon code');
    }

    cart.couponCode = couponDto.code.toUpperCase();
    cart.couponDiscount =
      coupon.type === 'percentage'
        ? (cart.subtotal * coupon.discount) / 100
        : coupon.discount;

    cart.total = cart.subtotal - cart.couponDiscount;

    return this.cartRepository.save(cart);
  }

  /**
   * Remove coupon from cart
   */
  async removeCoupon(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.couponCode = undefined;
    cart.couponDiscount = 0;
    cart.total = cart.subtotal;
    return this.cartRepository.save(cart);
  }

  /**
   * Move item to wishlist
   */
  async moveToWishlist(userId: string, productId: string): Promise<Cart> {
    // First remove from cart
    const cart = await this.removeFromCart(userId, productId);

    // TODO: Add to wishlist via WishlistService

    return cart;
  }

  /**
   * Recalculate cart totals
   */
  private async recalculateCart(cart: Cart): Promise<void> {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.totalSavings = cart.items.reduce((sum, item) => {
      if (item.compareAtPrice) {
        return sum + (item.compareAtPrice - item.unitPrice) * item.quantity;
      }
      return sum;
    }, 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    // Apply coupon if exists
    if (cart.couponDiscount > 0) {
      cart.total = cart.subtotal - cart.couponDiscount;
    } else {
      cart.total = cart.subtotal;
    }
  }
}
