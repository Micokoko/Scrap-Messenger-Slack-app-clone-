import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/appSlice';

const store = configureStore({
  reducer: {
    app: appReducer, // This assigns the appSlice.reducer to the 'app' key in the Redux store
    // Add other reducers here if you have more slices
  },
});

export default store;