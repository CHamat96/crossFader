import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: '',
  isLoggedIn: false
}

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload
    },
    setAccessToken: (state, action) => {
      state.token = action.payload
    },
  }
})

export const { setIsLoggedIn, setAccessToken } = authorizationSlice.actions;


export const accessToken = ({ authorization }) => authorization.token
export const loggedIn = ({ authorization }) => authorization.isLoggedIn

export default authorizationSlice.reducer;