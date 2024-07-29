import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '../reducers/customerReducer';

const store = configureStore({
  reducer: {
    customer: customerReducer,
  },
});

export default store;