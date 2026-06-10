import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './reducers';

// Tạo một store tổng quản lý state
export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});