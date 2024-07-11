import { configureStore } from "@reduxjs/toolkit";
import { useSelector as rawUseSelector } from "react-redux";

import { authSlice } from "./authSlice";

import type { TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
