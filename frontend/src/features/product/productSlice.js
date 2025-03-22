import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosi } from '../../config/axios';

const initialState = {
    products: [],
    status: 'idle',
    error: null
};

export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosi.get('/products');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

// Selectors
export const selectProducts = state => state.product.products;
export const selectProductStatus = state => state.product.status;
export const selectProductError = state => state.product.error;

export const { resetStatus } = productSlice.actions;

export default productSlice.reducer;