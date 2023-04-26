import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  query: '',
  searchResults: [],
  album: {},
  loading: true,
  albumReady: false,
  error: null
}

export const fetchAlbums = createAsyncThunk(`albumSearch/fetchAlbum`, async({token, query}) => {
  const url = new URL(`https://api.spotify.com/v1/search`)
  url.search = new URLSearchParams({
    q: query,
    type:'album',
    market: 'CA',
    limit: 25
  })
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()
  return data
}, [])

export const fetchSelectedAlbum = createAsyncThunk(`albumSearch/fetchSelectedAlbum`, async({token, albumID}) => {
  const response = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()
  return data
}, [])

const albumSearchSlice = createSlice({
  name: 'albumSearch',
  initialState,
  reducers: {
    setAlbumQuery: (state, action) => {
      state.query = action.payload
    },
    setRevertAlbum: (state) => {
      state.album = initialState.album
      state.albumReady = initialState.albumReady
    },
    setClearAlbumResults: (state) => {
      state.searchResults = []
    },
  },
  extraReducers: builder => 
  builder
  // Album Search Cases
  .addCase(fetchAlbums.pending, (state) => {
    state.loading = true
  })
  .addCase(fetchAlbums.fulfilled, (state, action) => {
    state.loading = false
    state.searchResults = action.payload.albums.items
  })
  .addCase(fetchAlbums.rejected, (state, action) => {
    state.error = action.payload
  })
  // Fetch Album Data Cases
  .addCase(fetchSelectedAlbum.pending, (state) => {
    state.loading = true
  })
  .addCase(fetchSelectedAlbum.fulfilled, (state, action) => {
    state.loading = false
    state.album = action.payload
    state.albumReady = true
  })
  .addCase(fetchSelectedAlbum.rejected, (state, action) => {
    state.error = action.payload
  })
})

export const { setAlbumQuery, setRevertAlbum,setClearAlbumResults } = albumSearchSlice.actions

export const selectAlbumQuery = ({ albumSearch }) => albumSearch.query
export const selectAlbumResults = ({ albumSearch }) => albumSearch.searchResults
export const selectedAlbum = ({ albumSearch }) => albumSearch.album
export const isAlbumSelected = ({ albumSearch }) => albumSearch.albumReady

export default albumSearchSlice.reducer