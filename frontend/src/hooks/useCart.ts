import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '@store/index';
import {
  fetchCart,
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateCartItemQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  updateLocalQuantity,
} from '@store/slices/cartSlice';
import type { AddToCartPayload } from '@/types/cart.types';
import toast from 'react-hot-toast';

/**
 * Custom hook for cart operations
 */
export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading, error, isUpdating } = useSelector(
    (state: RootState) => state.cart
  );

  /**
   * Load cart
   */
  const loadCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  /**
   * Add item to cart
   */
  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      try {
        await dispatch(addToCartAction(payload)).unwrap();
        toast.success('Added to cart!');
      } catch (error: any) {
        toast.error(error || 'Failed to add item');
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        await dispatch(removeFromCartAction(productId)).unwrap();
        toast.success('Removed from cart');
      } catch (error: any) {
        toast.error(error || 'Failed to remove item');
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }
      
      // Optimistic update
      dispatch(updateLocalQuantity({ productId, quantity }));
      
      try {
        await dispatch(updateQuantityAction({ productId, quantity })).unwrap();
      } catch (error: any) {
        // Revert on failure by reloading cart
        dispatch(fetchCart());
        toast.error(error || 'Failed to update quantity');
      }
    },
    [dispatch, removeFromCart]
  );

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  /**
   * Get cart item count
   */
  const itemCount = cart?.itemCount || 0;

  /**
   * Get cart total
   */
  const cartTotal = cart?.total || 0;

  /**
   * Check if product is in cart
   */
  const isInCart = useCallback(
    (productId: string) => {
      return cart?.items.some((item) => item.productId === productId) || false;
    },
    [cart]
  );

  return {
    cart,
    loading,
    error,
    isUpdating,
    itemCount,
    cartTotal,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };
}
