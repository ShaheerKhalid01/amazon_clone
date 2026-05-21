import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import wishlistService from '@services/wishlist.service';
import type { Wishlist, WishlistItem } from '@/types/wishlist.types';

/**
 * Wishlist State Interface
 */
interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
}

/**
 * Initial State
 */
const initialState: WishlistState = {
  wishlist: null,
  loading: false,
  error: null,
  isUpdating: false,
};

/**
 * Async Thunks
 */
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (
    { productId, variantId }: { productId: string; variantId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await wishlistService.addItem(productId, variantId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId: string, { rejectWithValue }) => {
    try {
      await wishlistService.removeItem(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

/**
 * Wishlist Slice
 */
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = null;
    },
    updateWishlistItemPriority: (
      state,
      action: PayloadAction<{ productId: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>
    ) => {
      if (state.wishlist) {
        const item = state.wishlist.items.find(
          (item) => item.productId === action.payload.productId
        );
        if (item) {
          item.priority = action.payload.priority;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add to Wishlist
    builder.addCase(addToWishlist.pending, (state) => {
      state.isUpdating = true;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.isUpdating = false;
      state.wishlist = action.payload;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload as string;
    });

    // Remove from Wishlist
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      if (state.wishlist) {
        state.wishlist.items = state.wishlist.items.filter(
          (item) => item.productId !== action.payload
        );
        state.wishlist.itemCount = state.wishlist.items.length;
      }
    });
  },
});

export const { clearWishlist, updateWishlistItemPriority } = wishlistSlice.actions;
export default wishlistSlice.reducer;
