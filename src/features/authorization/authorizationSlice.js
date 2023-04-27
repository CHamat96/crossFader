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
    revertAuth: (state) => {
      state.token = initialState.token
      state.isLoggedIn = initialState.isLoggedIn
    }
  }
})

export const { setIsLoggedIn, setAccessToken, revertAuth } = authorizationSlice.actions;


export const accessToken = ({ authorization }) => authorization.token
export const loggedIn = ({ authorization }) => authorization.isLoggedIn

export default authorizationSlice.reducer;