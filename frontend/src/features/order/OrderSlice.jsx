import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder, getAllOrders, getOrderByUserId, updateOrderById } from './OrderApi';
import Rating from '@mui/lab/Rating'; // Updated import for MUI v5

const initialState = {
  status: 'idle',
  orderUpdateStatus: 'idle',
  orderFetchStatus: 'idle',
  orders: [],
  currentOrder: null,
  errors: null,
  successMessage: null,
};

export const createOrderAsync = createAsyncThunk('orders/createOrderAsync', async (order) => {
  const createdOrder = await createOrder(order);
  return createdOrder;
});

export const getAllOrdersAsync = createAsyncThunk('orders/getAllOrdersAsync', async () => {
  const orders = await getAllOrders();
  return orders;
});

export const getOrderByUserIdAsync = createAsyncThunk('orders/getOrderByUserIdAsync', async (id) => {
  const orders = await getOrderByUserId(id);
  return orders;
});

export const updateOrderByIdAsync = createAsyncThunk('orders/updateOrderByIdAsync', async (update) => {
  const updatedOrder = await updateOrderById(update);
  return updatedOrder;
});

const orderSlice = createSlice({
  name: 'orderSlice',
  initialState: initialState,
  reducers: {
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrderUpdateStatus: (state) => {
      state.orderUpdateStatus = 'idle';
    },
    resetOrderFetchStatus: (state) => {
      state.orderFetchStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.status = 'rejected';
        state.errors = action.error;
      })

      .addCase(getAllOrdersAsync.pending, (state) => {
        state.orderFetchStatus = 'pending';
        state.errors = null; // Clear any previous errors
      })
      .addCase(getAllOrdersAsync.fulfilled, (state, action) => {
        state.orderFetchStatus = 'fulfilled';
        state.orders = action.payload || []; // Ensure this always returns an array
        state.errors = null;
      })
      .addCase(getAllOrdersAsync.rejected, (state, action) => {
        state.orderFetchStatus = 'rejected';
        state.orders = []; // Reset to empty array on error
        state.errors = action.error;
      })

      .addCase(getOrderByUserIdAsync.pending, (state) => {
        state.orderFetchStatus = 'pending';
      })
      .addCase(getOrderByUserIdAsync.fulfilled, (state, action) => {
        state.orderFetchStatus = 'fulfilled';
        state.orders = action.payload;
      })
      .addCase(getOrderByUserIdAsync.rejected, (state, action) => {
        state.orderFetchStatus = 'rejected';
        state.errors = action.error;
      })

      .addCase(updateOrderByIdAsync.pending, (state) => {
        state.orderUpdateStatus = 'pending';
      })
      .addCase(updateOrderByIdAsync.fulfilled, (state, action) => {
        state.orderUpdateStatus = 'fulfilled';
        const index = state.orders.findIndex((order) => order._id === action.payload._id);
        state.orders[index] = action.payload;
      })
      .addCase(updateOrderByIdAsync.rejected, (state, action) => {
        state.orderUpdateStatus = 'rejected';
        state.errors = action.error;
      });
  },
});

// Exporting reducers
export const { resetCurrentOrder, resetOrderUpdateStatus, resetOrderFetchStatus } = orderSlice.actions;

// Exporting selectors
export const selectOrderStatus = (state) => state.orderSlice?.status || 'idle';
export const selectOrders = (state) => state.orderSlice?.orders || [];
export const selectOrdersErrors = (state) => state.orderSlice.errors;
export const selectOrdersSuccessMessage = (state) => state.orderSlice.successMessage;
export const selectCurrentOrder = (state) => state.orderSlice.currentOrder;
export const selectOrderUpdateStatus = (state) => state.orderSlice.orderUpdateStatus;
export const selectOrderFetchStatus = (state) => state.orderSlice?.orderFetchStatus || 'idle';

// Exporting the reducer
export default orderSlice.reducer; // Corrected export