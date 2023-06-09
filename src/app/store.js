import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from '../features/authorization/authorizationSlice'
import userReducer from '../features/user/userSlice'
import artistSearchReducer from '../features/search/artistSearchSlice'
import albumSearchReducer from '../features/search/albumSearchSlice'
import playlistReducer from '../features/playlist/playlistSlice'

export const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    userData: userReducer,
    artistSearch: artistSearchReducer,
    albumSearch: albumSearchReducer,
    playlist: playlistReducer
  }
})