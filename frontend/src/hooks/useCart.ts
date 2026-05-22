import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@store/index';
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction, updateCartItemQuantity as updateQuantityAction, clearCart as clearCartAction, updateLocalQuantity } from '@store/slices/cartSlice';
import type { AddToCartPayload } from '@/types/cart.types';
import toast from 'react-hot-toast';
import { fetchCart } from '@store/slices/cartSlice';

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { cart, loading, error, isUpdating } = useSelector((state: RootState) => state.cart);

  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      // ✅ Check login first
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }

      try {
        await dispatch(addToCartAction(payload)).unwrap();
        toast.success('Added to cart!');
      } catch (error: any) {
        const msg = typeof error === 'string' ? error : error?.message || 'Failed to add item';
        toast.error(msg);

        // ✅ If 401, redirect to login
        if (msg.includes('401') || msg.includes('Unauthorized') || msg.includes('unauthorized')) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        }
        throw error;
      }
    },
    [dispatch, navigate]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        await dispatch(removeFromCartAction(productId)).unwrap();
        toast.success('Removed from cart');
      } catch (error: any) {
        const msg = typeof error === 'string' ? error : error?.message || 'Failed';
        toast.error(msg);
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
        toast.error('Failed to update quantity');
      }
    },
    [dispatch, removeFromCart]
  );

  const clearCart = useCallback(() => dispatch(clearCartAction()), [dispatch]);

  const itemCount = cart?.itemCount || 0;
  const cartTotal = cart?.total || 0;

  return {
    cart, loading, error, isUpdating, itemCount, cartTotal,
    addToCart, removeFromCart, updateQuantity, clearCart,
  };
}