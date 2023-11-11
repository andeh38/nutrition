import { configureStore } from '@reduxjs/toolkit';
import appSlice from "./appSlice";


export const store = configureStore({
  reducer: {
    day: appSlice,
    analytics: appSlice,
    food: appSlice,
    isAuthenticated: appSlice,
    authError: appSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch