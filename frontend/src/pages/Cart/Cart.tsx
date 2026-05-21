import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@hooks/useCart';
import CartItem from '@components/cart/CartItem/CartItem';
import CartSummary from '@components/cart/CartSummary/CartSummary';
import Button from '@components/ui/Button/Button';
import Spinner from '@components/ui/Spinner/Spinner';
import { formatPrice } from '@utils/formatPrice';
import { FaShoppingCart, FaArrowLeft, FaTrash } from 'react-icons/fa';

/**
 * Cart Page Component
 */
const Cart: React.FC = () => {
  const {
    cart,
    loading,
    isUpdating,
    itemCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Empty Cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-amazon mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <FaShoppingCart className="text-6xl text-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
              <p className="text-gray-600 mt-2">
                Discover deals and products you'll love.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/deals">
              <Button variant="secondary" size="lg">
                Shop Today's Deals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-amazon mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Shopping Cart
          <span className="text-lg text-gray-500 ml-2">({itemCount} items)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <FaTrash />
          Clear Cart
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {cart.items.map((item) => (
              <CartItem
                key={`${item.productId}-${item.variant?.id || 'default'}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                isUpdating={isUpdating}
              />
            ))}
          </div>

          {/* Subtotal */}
          <div className="mt-4 text-right">
            <p className="text-sm text-gray-600">
              Subtotal ({itemCount} items):{' '}
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(cart.subtotal)}
              </span>
            </p>
          </div>
        </div>

        {/* Cart Summary Sidebar */}
        <div className="lg:w-80">
          <div className="sticky top-24">
            <CartSummary
              cart={cart}
              itemCount={itemCount}
            />
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 flex items-center gap-2">
        <FaArrowLeft className="text-gray-400" />
        <Link to="/products" className="text-amazon-blue hover:underline text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
