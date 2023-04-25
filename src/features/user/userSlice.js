import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  userID: '',
  topArtists: [],
  hasTopArtists: false,
  loading: false,
  error: null
}

export const fetchUser = createAsyncThunk(`userData/fetchUser`, async(token) => {
  const response = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data
})


export const fetchTopArtists = createAsyncThunk(`userData/fetchTopArtists`, async(token) => {
  const url = new URL(`https://api.spotify.com/v1/me/top/artists`)
  url.search = new URLSearchParams({
    time_range: "short_term",
    limit:5
  })
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data
})

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
  builder
  .addCase(fetchUser.pending, (state) => {
    state.loading = true
  })
  .addCase(fetchUser.fulfilled, (state, action) => {
    state.loading = false
    state.userID = action.payload.id
  })
  .addCase(fetchUser.rejected, (state, action) => {
    state.error = action.error
  })
  .addCase(fetchTopArtists.pending, (state) => {
    state.loading = true
  })
  .addCase(fetchTopArtists.fulfilled, (state, action) => {
    state.loading = false
    state.topArtists = action.payload.items
    state.hasTopArtists = true
  })
  .addCase(fetchTopArtists.rejected, (state, action) => {
    state.error = action.error
  })
})


export const selectUserID = (state) => state.userData.userID
export const selectTopArtists = (state) => state.userData.topArtists
export default userDataSlice.reducer