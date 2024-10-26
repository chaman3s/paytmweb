import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  balance: 0,
  recipient: '',
  amount: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
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