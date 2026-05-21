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

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading, error, isUpdating } = useSelector((state: RootState) => state.cart);

  const loadCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      try {
        await dispatch(addToCartAction(payload)).unwrap();
        toast.success('Added to cart!');
      } catch (error: any) {
        const msg = typeof error === 'string' ? error : error?.message || 'Failed to add item';
        toast.error(msg);
        throw error;
      }
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        await dispatch(removeFromCartAction(productId)).unwrap();
        toast.success('Removed from cart');
      } catch (error: any) {
        const msg = typeof error === 'string' ? error : error?.message || 'Failed to remove item';
        toast.error(msg);
        throw error;
      }
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }
      dispatch(updateLocalQuantity({ productId, quantity }));
      try {
        await dispatch(updateQuantityAction({ productId, quantity })).unwrap();
      } catch (error: any) {
        dispatch(fetchCart());
        const msg = typeof error === 'string' ? error : error?.message || 'Failed to update quantity';
        toast.error(msg);
      }
    },
    [dispatch, removeFromCart]
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const itemCount = cart?.itemCount || 0;
  const cartTotal = cart?.total || 0;

  const isInCart = useCallback(
    (productId: string) => {
      return cart?.items.some((item) => item.productId === productId) || false;
    },
    [cart]
  );

  return {
    cart,
    loading,
    error: typeof error === 'string' ? error : (error as any)?.message || null,
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