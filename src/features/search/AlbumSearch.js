import React from "react";

import {
  selectAlbumQuery,
  setAlbumQuery,
  fetchAlbums,
  fetchSelectedAlbum,
  selectAlbumResults,
  selectedAlbum,
  isAlbumSelected,
  setClearAlbumResults,
  setRevertAlbum
} from './albumSearchSlice'

 import { accessToken } from "../authorization/authorizationSlice";
 import { TbVinyl } from 'react-icons/tb'
 import { CiCircleRemove } from 'react-icons/ci'
 import { useSelector, useDispatch } from "react-redux";


 export function AlbumSearch(){
  const dispatch = useDispatch()
  // Queries
  const albumQuery = useSelector(selectAlbumQuery)
  // Search Results
  const albumResults = useSelector(selectAlbumResults)
  // Selection(s)
  const album = useSelector(selectedAlbum)

  // Booleans/Loading/truthy/etc.
  const albumSelected = useSelector(isAlbumSelected)

  // other
  const token = useSelector(accessToken)

  function handleArtistQuery(e){
    const value = e.target.value
    if(value.length > 0){
      dispatch(setAlbumQuery(value))
      dispatch(fetchAlbums({token: token, query: albumQuery}))
    } else if (value.length === 0){
      handleAlbumQueryClear()
    }
  }

  function handleAlbumSelection(e, albumID){
    dispatch(fetchSelectedAlbum({ token: token, albumID: albumID }))
    handleAlbumQueryClear()
  }
  

  function handleAlbumQueryClear(){
    dispatch(setClearAlbumResults())
    dispatch(setAlbumQuery(''))
  }

  function handleRemoveAlbum(e, album){
    e.preventDefault()
    dispatch(setRevertAlbum(album))
  }

  return (
          <div className="queryContainer">
            <label htmlFor="albumSearch" className="relative w-4/5">
              <p>Search for an album (optional)</p>
              <input 
              type="text" 
              name="artistSearch" 
              id="artistSearch" 
              className="bg-[#ffffff] border-2 border-s-4 border-e-4 border-solid border-black rounded  w-full" 
              autoComplete="off"
              value={albumQuery} 
              onChange={handleArtistQuery} />
              {albumResults && albumResults.length > 0 && 
              <div className="resultsList">
                {albumResults.map((album, index) => {
                  return (
                    <div 
                    className="resultContainer"
                    key={`${album.id}-${index}`}
                    onClick={(e) => handleAlbumSelection(e, album.id)}
                    >
                    {album.images[2] ? <img src={album.images[2].url} className="w-[50px] h-[50px]" alt={album.name} />  : <TbVinyl className="text-[50px]" />}
                    <p>{album.name}</p>
                    </div>
                  )
                })}
              </div>
              }
            </label>
            {albumSelected && 
            
              <div className="artistSelection">
                <h3>Your Selected Album:</h3>
                <div className="flex flex-wrap gap-2">
                      <div key={`${album.id}`}>
                        <button 
                        aria-label={`Remove ${album.name} from selection`}
                        onClick={(e) => handleRemoveAlbum(e, album)}
                        title={`Remove ${album.name}`}
                        className="w-36 my-2 relative">
                          {album.images[0] && <img src={album.images[0].url} 
                          alt={album.name} /> }
                          <div className="absolute h-[100%] w-[100%] opacity-0 top-0 text-white font-bold backdrop-blur-lg flex flex-column items-center hover:opacity-100 border-solid border-8 border-black" >
                          <p>Remove album from Selection?</p>
                        </div>
                        </button>
                      </div>
                </div>
              </div>
            }
          </div>
  )
 }