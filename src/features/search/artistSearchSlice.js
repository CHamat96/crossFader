import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  query: '',
  searchResults: [],
  artists: [],
  hasArtists: false,
  artistsLoading: null,
  error: null,
  topTracks: [],
  tracksLoading: false
}

// Fetch Request #1: display search results as user enters their query
export const fetchArtists = createAsyncThunk(`artistSearch/fetchArtists`, async({token, query}) => {
  const url = new URL(`https://api.spotify.com/v1/search`)
  url.search = new URLSearchParams({
    q: query,
    type: 'artist',
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

// When queried artists are selected, fetch their top-tracks
export const fetchTopTracks = createAsyncThunk(`artistSearch/fetchTopTracks`, async({token, artistID}) => {
  const url = new URL(`https://api.spotify.com/v1/artists/${artistID}/top-tracks`)
  url.search = new URLSearchParams({
    market: 'CA'
  })
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()
  return data
})


const artistSearchSlice = createSlice({
  name: 'artistSearch',
  initialState,
  reducers: {
    setArtistQuery: (state, action) => {
      state.query = action.payload
    },
    setSelectedArtists: (state, action) => {
      state.artists.push(action.payload)
      state.hasArtists = true
    },
    clearArtistResults: (state) => {
      state.searchResults = initialState.searchResults
    },
    // Clear a Specific Selection
    setRemoveArtist: (state, action) => {
      state.artists = state.artists.filter(artist => 
        artist.id !== action.payload.id
        )
      state.hasArtists = state.artists.length > 0
    },
    // Clear All Selections
    revertArtists: (state) => {
      state.artists = initialState.artists
      state.hasArtists = initialState.hasArtists
    },
    setRemoveTracks: (state, action) => {
      state.topTracks = state.topTracks.filter(track => 
        track.artists.every(artist => artist.id !== action.payload))
    }
  },
  extraReducers: builder => 
  builder
  // cases for Artist Query
  .addCase(fetchArtists.pending, (state) => {
    state.artistsLoading = true
  })
  .addCase(fetchArtists.fulfilled, (state, action) => {
    state.artistsLoading = false
    state.searchResults = action.payload.artists.items
  })
  .addCase(fetchArtists.rejected, (state, action) => {
    state.error = action.payload
  })
  .addCase(fetchTopTracks.pending, (state) => {
    state.tracksLoading = true
  })
  .addCase(fetchTopTracks.fulfilled, (state, action) => {
    state.tracksLoading = false
    state.topTracks = state.topTracks.concat(action.payload.tracks)
  })
  .addCase(fetchTopTracks.rejected, (state, action) => {
    state.error = action.error
  })
})

export const { setArtistQuery, setSelectedArtists, clearArtistResults, setRemoveArtist, revertArtists, setRemoveTracks } = artistSearchSlice.actions

export const selectArtistQuery = ({ artistSearch }) => artistSearch.query
export const selectArtistResults = ({ artistSearch }) => artistSearch.searchResults
export const allSelectedArtists = ({ artistSearch }) => artistSearch.artists
export const areArtistsSelected = ({ artistSearch }) => artistSearch.hasArtists
export const selectTopTracks = ({ artistSearch }) => artistSearch.topTracks
export const areTracksReady = ({ artistSearch }) => artistSearch.tracksLoading


export default artistSearchSlice.reducer
