import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    coupons: [],
    status: 'idle',
    error: null
};

export const fetchCoupons = createAsyncThunk(
    'coupons/fetchCoupons',
    async () => {
        const response = await axios.get('/api/coupons');
        return response.data;
    }
);

const couponSlice = createSlice({
    name: 'coupons',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.coupons = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const selectCoupons = (state) => state.coupons.coupons;
export const selectCouponStatus = (state) => state.coupons.status;

export default couponSlice.reducer;