import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 friendsDetail:[]
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
  
    update: (state, action) => {
      state.friendsDetail = action.payload;
    }
  },
});

export const {update}  = friendSlice.actions;
export default friendSlice.reducer;