import React from "react";
import { accessToken } from "../authorization/authorizationSlice";
import { selectTopArtists } from "../user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchTopTracks, setRemoveArtist, setRemoveTracks, setSelectedArtists, allSelectedArtists } from "./artistSearchSlice";
import { TbVinyl } from "react-icons/tb";
import { revertRecs } from "../playlist/playlistSlice";

export function TopArtists(){
  const dispatch = useDispatch()
  const topArtists = useSelector(selectTopArtists)
  const token = useSelector(accessToken)
  const artists = useSelector(allSelectedArtists)

  function handleArtistCheckbox(e, artist) {
    const checked = e.target.checked
    if(checked && artists.length < 4){
      dispatch(setSelectedArtists(artist))
      dispatch(fetchTopTracks({ token: token, artistID: artist.id }))
    } else {
      dispatch(setRemoveArtist(artist))
      dispatch(setRemoveTracks(artist.id))
      dispatch(revertRecs())
    }
  }

  return (
    <fieldset>
      <legend className="font-accent text-md">Or, Select one of your current "top artists"</legend>
      <div className="my-0 mx-auto flex items-center flex-wrap gap-2">
      {topArtists.map((artist, index) => {
          return(
            <label key={`${artist.id}-${index}`} htmlFor={`option-${index}`} className="flex flex-[1_1_auto] flex-col gap-1 items-center">
              <input 
              type="checkbox" 
              name="topArtistSelection" 
              id={`option-${index}`} 
              value={artist.id}
              checked={artists.some(selectedArtist => selectedArtist.id === artist.id)} //Automatically check the input if the artist is already selected
              className="topArtistsCheck"
              onChange={(e) => handleArtistCheckbox(e, artist)}/>
              {artist.images[2] ? <img src={artist.images[2].url} alt={artist.name} className={`w-[75px] h-[75px]`} /> : <TbVinyl />}
              <p>{artist.name}</p>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}