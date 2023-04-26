import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import  { ArtistSearch }  from './ArtistSearch'
import { AlbumSearch } from './AlbumSearch'
import { TopArtists } from './TopArtists'
import { allSelectedArtists, areArtistsSelected, selectTopTracks } from './artistSearchSlice'
import { isAlbumSelected, selectedAlbum } from './albumSearchSlice'
import { accessToken } from '../authorization/authorizationSlice'
import { fetchRecs, selectAllRecs, revertRecs } from '../playlist/playlistSlice'


export function UserInput(){
  const dispatch = useDispatch()
  const albumReady = useSelector(isAlbumSelected)
  const artistsReady = useSelector(areArtistsSelected)
  const token = useSelector(accessToken)
  

  const album = useSelector(selectedAlbum)
  const artists = useSelector(allSelectedArtists)
  const topTracks = useSelector(selectTopTracks)
  const allRecs = useSelector(selectAllRecs)


  function handleGetAlbumRecs(e){
    e.preventDefault();
    dispatch(revertRecs())
    const albumTracks = album.tracks.items.map(track => track)
    albumTracks.forEach(track => {
      dispatch(fetchRecs({ token: token, track: track, artists: artists }))
    })
  }

  function handleGetArtistRecs(e){
    e.preventDefault()
    dispatch(revertRecs())
    topTracks.forEach(track => {
      dispatch(fetchRecs({ token: token, track: track, artists: artists, album: track.album }))
    })
  }
  return (
    <div className="bg-[#fff] p-8 flex-auto border-2 border-black rounded-2xl max-h-content max-w-2xl shadow-sm shadow-slate-600">
      <h2 className="text-xl font-accent font-black">Select your favourite artists (and maybe your favourite album) to get started!</h2>
    <fieldset>
      <div className="flex flex-wrap items-start gap-4">
        <AlbumSearch />
        <ArtistSearch />
      </div>
    </fieldset>
    <TopArtists />
    {
      albumReady && artistsReady ?
      (
        <button
        onClick={handleGetAlbumRecs}
        className="getRecs">Generate the Playlist!</button>
      ) : artistsReady && artists.length > 1 ? (
        <button className="getRecs" onClick={handleGetArtistRecs}>Generate the Playlist!</button>
      ) : ""
    }
    </div>
  )
}