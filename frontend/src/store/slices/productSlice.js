import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    status: 'idle',
    error: null
};

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async () => {
        const response = await axios.get('/api/products');
        return response.data;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
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
                state.error = action.error.message;
            });
    }
});

export const selectProducts = (state) => state.products.products;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

export default productSlice.reducer;