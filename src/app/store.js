import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from '../features/authorization/authorizationSlice'


export const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
  }
})