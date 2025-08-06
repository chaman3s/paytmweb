import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Number:0,
  balance: 0,
  recipient: 0,
  amount: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setNumber: (state, action) => {
      state.Number = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setRecipient: (state, action) => {
      console.log("ok1")
      state.recipient = action.payload;
     console.log("reci:",state.recipient)
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

export const { setNumber, setBalance, setRecipient, setAmount, resetTransfer ,setUsername} = userSlice.actions;
export default userSlice.reducer;