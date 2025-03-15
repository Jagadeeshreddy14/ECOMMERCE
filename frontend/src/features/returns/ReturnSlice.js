import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createReturn, getAllReturns, updateReturnStatus } from './ReturnAPI';

const initialState = {
  returns: [],
  status: 'idle',
  error: null
};

export const createReturnAsync = createAsyncThunk(
  'return/createReturn',
  async (returnData) => {
    const response = await createReturn(returnData);
    return response.data;
  }
);

export const getAllReturnsAsync = createAsyncThunk(
  'returns/getAllReturns',
  async () => {
    const response = await getAllReturns();
    return response.data;
  }
);

export const updateReturnStatusAsync = createAsyncThunk(
  'returns/updateStatus',
  async ({ returnId, status }) => {
    const response = await updateReturnStatus(returnId, status);
    return response.data;
  }
);

export const returnSlice = createSlice({
  name: 'return',
  initialState,
  reducers: {
    resetReturnStatus: (state) => {
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReturnAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createReturnAsync.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.returns.push(action.payload);
      })
      .addCase(createReturnAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getAllReturnsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllReturnsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.returns = action.payload;
      })
      .addCase(updateReturnStatusAsync.fulfilled, (state, action) => {
        const index = state.returns.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.returns[index] = action.payload;
        }
      });
  },
});

export const { resetReturnStatus } = returnSlice.actions;
export const selectReturns = (state) => state.return.returns;
export const selectReturnStatus = (state) => state.return.status;

export default returnSlice.reducer;