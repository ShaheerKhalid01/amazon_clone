import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import cartService from '@services/cart.service';
import type { Cart, CartItem, AddToCartPayload } from '@/types/cart.types';

/**
 * Cart State Interface
 */
interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
}

/**
 * Initial State
 */
const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  isUpdating: false,
};

/**
 * Async Thunks
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload: AddToCartPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Please login first');
      }
      const response = await cartService.addToCart(payload);
      return response;
    } catch (error: any) {
      // ✅ Better error message
      if (error?.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error?.message || 'Failed to add item to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove item');
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartService.updateQuantity(productId, quantity);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update quantity');
    }
  }
);

/**
 * Cart Slice
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
    setCartItemGift: (
      state,
      action: PayloadAction<{ productId: string; isGift: boolean; giftMessage?: string }>
    ) => {
      if (state.cart) {
        const item = state.cart.items.find(
          (item) => item.productId === action.payload.productId
        );
        if (item) {
          item.isGift = action.payload.isGift;
          item.giftMessage = action.payload.giftMessage || '';
        }
      }
    },
    updateLocalQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      if (state.cart) {
        const item = state.cart.items.find(
          (item) => item.productId === action.payload.productId
        );
        if (item) {
          item.quantity = action.payload.quantity;
          item.totalPrice = item.unitPrice * action.payload.quantity;

          // Recalculate cart total
          state.cart.subtotal = state.cart.items.reduce(
            (sum, i) => sum + i.totalPrice,
            0
          );
          state.cart.itemCount = state.cart.items.reduce(
            (sum, i) => sum + i.quantity,
            0
          );
        }
      }
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.isUpdating = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isUpdating = false;
      state.cart = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload as string;
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.isUpdating = true;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isUpdating = false;
      if (state.cart) {
        state.cart.items = state.cart.items.filter(
          (item) => item.productId !== action.payload
        );
        state.cart.itemCount = state.cart.items.reduce(
          (sum, i) => sum + i.quantity,
          0
        );
        state.cart.subtotal = state.cart.items.reduce(
          (sum, i) => sum + i.totalPrice,
          0
        );
      }
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload as string;
    });

    // Update Quantity
    builder.addCase(updateCartItemQuantity.pending, (state) => {
      state.isUpdating = true;
    });
    builder.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      state.isUpdating = false;
      state.cart = action.payload;
    });
    builder.addCase(updateCartItemQuantity.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  clearCart,
  setCartItemGift,
  updateLocalQuantity,
  clearCartError,
} = cartSlice.actions;
export default cartSlice.reducer;
