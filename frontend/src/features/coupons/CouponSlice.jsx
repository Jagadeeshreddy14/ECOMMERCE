// frontend/src/features/coupons/CouponSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Import axios

export const fetchCouponsAsync = createAsyncThunk(
  'coupons/fetchCoupons',
  async () => {
    const response = await axios.get('/api/coupons');
    return response.data;
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCouponsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCouponsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCouponsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { } = couponSlice.actions;

export const selectAllCoupons = (state) => state.coupon.list;

export default couponSlice.reducer;