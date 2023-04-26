import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import  { ArtistSearch }  from './ArtistSearch'
import { AlbumSearch } from './AlbumSearch'
import { TopArtists } from './TopArtists'
import { allSelectedArtists, areArtistsSelected, selectTopTracks } from './artistSearchSlice'
import { isAlbumSelected, selectedAlbum } from './albumSearchSlice'
import { accessToken } from '../authorization/authorizationSlice'
import { fetchRecs, selectAllRecs, revertRecs, isPlaylistLoading } from '../playlist/playlistSlice'
import { PlaylistDisplay } from '../playlist/Playlist'


export function UserInput(){
  const dispatch = useDispatch()
  const albumReady = useSelector(isAlbumSelected)
  const artistsReady = useSelector(areArtistsSelected)
  const token = useSelector(accessToken)
  

  const album = useSelector(selectedAlbum)
  const artists = useSelector(allSelectedArtists)
  const topTracks = useSelector(selectTopTracks)
  const allRecs = useSelector(selectAllRecs)


  const playlistLoading = useSelector(isPlaylistLoading)



  function handleGetAlbumRecs(e){
    e.preventDefault();
    dispatch(revertRecs())
    const albumTracks = album.tracks.items.map(track => track)
    albumTracks.forEach(track => {
      dispatch(fetchRecs({ token: token, track: track, artists: artists, album: album }))
    })
  }

  function handleGetArtistRecs(e){
    e.preventDefault()
    dispatch(revertRecs())
    topTracks.forEach(track => {
      dispatch(fetchRecs({ token: token, track: track, artists: artists }))
    })
  }
  return (
    <div className="bg-[#fff] p-8 flex-auto border-2 border-black rounded-2xl max-h-content max-w-3/5 shadow-sm shadow-slate-600">
      <h2 className="text-xl font-accent font-black">Select your favourite artists (and maybe your favourite album) to get started!</h2>
    <fieldset>
      <div className="flex flex-wrap items-start gap-2 max-w-3/5">
        <AlbumSearch />
        <ArtistSearch />
      </div>
    </fieldset>
    <fieldset></fieldset>
    <TopArtists />
    {
      albumReady && artistsReady ?
      (
          <button
          onClick={handleGetAlbumRecs}
          className="button">Generate the Playlist!</button>
      ) : artistsReady && artists.length > 1 ? (
        <button className="button" onClick={handleGetArtistRecs}>Generate the Playlist!</button>
      ) : ""
    }
    {playlistLoading === false && 
      <PlaylistDisplay />
    }
    </div>
  )
}