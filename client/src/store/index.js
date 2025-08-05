import { configureStore } from '@reduxjs/toolkit';
import userSlice from './reducers/userSlice';
import friendSlice from "./reducers/friendSlice"
const store = configureStore({
  reducer: {
    user: userSlice,
    friend: friendSlice,
  },
});

export default store;
