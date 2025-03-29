import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 
  balance: 10000,
};

const userSlice = createSlice({
  name: 'bankAccount',
  initialState,
  reducers: {
  
    setRecipient: (state, action) => {
      state.recipient = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    resetTransfer: (state) => {
      state.recipient = '';
      state.amount = 0;
    },
  },
});

export const { setUsername, setBalance, setRecipient, setAmount, resetTransfer } = userSlice.actions;
export default userSlice.reducer;