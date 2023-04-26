import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  allRecs: [],
  recsLoading: null,
  recsError: null
}

let tempArray = []

export const fetchRecs = createAsyncThunk(`playlist/fetchRecs`, async({ token, track, artists, album }) => {
  tempArray = []
  const seed_artists = artists.map(artist => artist.id).join(',')

    // if a specified album is selected, adjust the "track" element to include important properties from the "album" object
    if(album){
        track = {
          ...track,
          album: {
            name: album.name,
            images: album.images,
          },
          artists: album.artists,
        }
      }
  const url = new URL(`https://api.spotify.com/v1/recommendations`)
  url.search = new URLSearchParams({
    limit:100,
    market: 'CA',
    seed_tracks: track.id,
    seed_artists,
    max_liveness: 0.450
  })
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()

  const allRecTracks = data.tracks
  const filteredRecs = allRecTracks.filter(recTrack => {
    return artists.some(queriedArtist => queriedArtist.id === recTrack.artists[0].id)
  })
  tempArray = [
    ...tempArray,
    { 
      track,
      filteredRecs
    }
  ];
  return tempArray
})

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    revertRecs: (state) => {
      state.allRecs = initialState.allRecs
      state.playlistLoading = initialState.playlistLoading
    }
  },
  extraReducers: builder => 
  builder
  .addCase(fetchRecs.pending, (state) => {
    state.recsLoading = true
  })
  .addCase(fetchRecs.fulfilled, (state, action) => {
    const recs = action.payload

    // Sort tracks by the queried album's track order, then flatten each { track, filteredRecs } object into a single array
    let sortedTracks = recs.sort((itemA, itemB) => {
      return itemA.track.track_number - itemB.track.track_number
    }).reduce((result, item) => {
      result.push(item.track);
      if(item.filteredRecs){
        item.filteredRecs.forEach(track => result.push(track))
      }
      return result
    }, [])

    // filter out any duplicates
    let finalFiltered = sortedTracks.filter((value, index, self) => {
      return index === self.findIndex((t) => (
        t.place === value.place && t.name === value.name
      ))
    })

    state.allRecs = finalFiltered
    state.playlistLoading = false
  })
  .addCase(fetchRecs.rejected, (state, action) => {
    state.recsError = action.payload
  })
})

export const { revertRecs } = playlistSlice.actions
export const selectAllRecs = ({ playlist }) => playlist.allRecs
export const isPlaylistLoading = ({ playlist }) => playlist.playlistLoading

export default playlistSlice.reducer