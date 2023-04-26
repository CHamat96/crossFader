import React from "react";

import { 
  setArtistQuery,
  setRemoveArtist,
  setSelectedArtists,
  selectArtistQuery,
  selectArtistResults,
  allSelectedArtists,
  fetchArtists,
  clearArtistResults,
  selectTopTracks,
  setRemoveTracks,
  fetchTopTracks
 } from './artistSearchSlice'

 import { revertRecs } from "../playlist/playlistSlice";
 import { accessToken } from "../authorization/authorizationSlice";
 import { TbVinyl } from 'react-icons/tb'
 import { CiCircleRemove } from 'react-icons/ci'
 import { useSelector, useDispatch } from "react-redux";


 export function ArtistSearch(){
  const dispatch = useDispatch()
  // Queries
  const artistQuery = useSelector(selectArtistQuery)

  // Search Results
  const artistResults = useSelector(selectArtistResults)

  // Selection(s)
  const artists = useSelector(allSelectedArtists)
  const topTracks = useSelector(selectTopTracks)

  // other
  const token = useSelector(accessToken)

  function handleArtistQuery(e){
    const value = e.target.value
    if(value.length > 0){
      dispatch(setArtistQuery(value))
      dispatch(fetchArtists({token: token, query: artistQuery}))
    } else if (value.length === 0){
      handleArtistClear()
    }
  }

  function handleArtistSelection(e, artist){
    if(!artists.some(selectedArtist => selectedArtist.id === artist.id) && artists.length < 4){
      dispatch(setSelectedArtists(artist))
      dispatch(fetchTopTracks({ token: token, artistID: artist.id }))
    } else if (artists.some(selectedArtist => selectedArtist.id === artist.id)){
      alert(`${artist.name} is already selected! Choose someone different!`)
    } else if (artists.length >=4){
      alert(`Can only choose up to 4 artists`)
    }
    handleArtistClear()
  }

  function handleArtistClear(){
    dispatch(clearArtistResults())
    dispatch(setArtistQuery(''))
  }

  function handleRemoveArtist(e, artist){
    e.preventDefault()
    const isChecked = document.querySelector(`input[value="${artist.id}"]`)
    dispatch(setRemoveArtist(artist))
    dispatch(setRemoveTracks(artist.id))
    dispatch(revertRecs())
    if(isChecked){
      isChecked.checked = false
    }
  }

  return (
          <div className="queryContainer">
            <label htmlFor="artistSearch" className="relative w-4/5">
              <p>Search for a band/artist</p>
              <input 
              type="text" 
              name="artistSearch" 
              id="artistSearch" 
              className="bg-[#ffffff] border-2 border-s-4 border-e-4 border-solid border-black rounded  w-full" 
              autoComplete="off"
              value={artistQuery} 
              onChange={handleArtistQuery} />
              {artistResults && artistResults.length > 0 && 
              <div className="resultsList">
                {artistResults.map((artist, index) => {
                  return (
                    <div 
                    className="resultContainer"
                    key={`${artist.id}-${index}`}
                    onClick={(e) => handleArtistSelection(e, artist)}
                    >
                    {artist.images[2] ? <img src={artist.images[2].url} className="w-[50px] h-[50px]" alt={artist.name} />  : <TbVinyl className="text-[50px]" />}
                    <p>{artist.name}</p>
                    </div>
                  )
                })}
              </div>
              }
            </label>
            {artists && artists.length > 0 &&
            <div className="artistSelection">
              <h3>You Selected:</h3>
              <div className="flex flex-wrap gap-2">
                {artists.map((artist, index) => {
                  return (
                    <div className="inline-flex flex-auto gap-2.5 items-center 
                    max-w-fit content-space-between bg-orange px-4 py-2 rounded-md text-white border-black border-solid border-2" key={`${artist.id}-${index}`}>
                      <p>{artist.name}</p>
                      <button 
                      aria-label={`Remove ${artist.name} from selection`}
                      onClick={(e) => handleRemoveArtist(e, artist)}
                      title={`Remove ${artist.name}`}
                      className="text-bolder">
                        <CiCircleRemove />
                      </button>
                    </div>
                  )
                }) 
                }
              </div>
            </div>
            }
          </div>
  )
 }