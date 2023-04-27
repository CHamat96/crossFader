import { Fragment, useRef, useState } from "react";
import { selectAllRecs, isPlaylistLoading, togglePlaylistOpen, isPlaylistOpen } from "./playlistSlice";
import ReactAudioPlayer from "react-audio-player";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { CiCircleRemove } from 'react-icons/ci'
import { BsExplicit }  from 'react-icons/bs'
import { selectUserID } from "../user/userSlice";
import { accessToken } from "../authorization/authorizationSlice";
import { allSelectedArtists, areArtistsSelected } from "../search/artistSearchSlice";
import { isAlbumSelected, selectedAlbum } from "../search/albumSearchSlice";
import { current } from "@reduxjs/toolkit";
export function PlaylistDisplay({ refreshTracks }){

  const previewRef = useRef([])
  const dispatch = useDispatch()
  // const [open, setOpen] = useState(true)
  const [previewPlaying, setPreviewPlaying] = useState({})
  const [currentPreview, setCurrentPreview] = useState(null)

  const playlistOpen = useSelector(isPlaylistOpen)

  const playlistLoading = useSelector(isPlaylistLoading)
  const allRecs = useSelector(selectAllRecs)
  const userID = useSelector(selectUserID)
  const token = useSelector(accessToken)
  const artists = useSelector(allSelectedArtists)
  const album = useSelector(selectedAlbum)

  const hasAlbum = useSelector(isAlbumSelected)
  const hasArtists = useSelector(areArtistsSelected)

  const playlistName = hasAlbum && allRecs ? `${album.name}: CrossFaded` : hasArtists ? `${artists.map(artist => artist.name).join(', ').replace(/,([^,]*)$/, ' &$1')}: CrossFaded` : null

  const playlistDescription = hasAlbum && allRecs ? `Pairing songs from ${album.name} by ${album.artists[0].name} with various tracks by ${artists.map(artist => artist.name).join(', ').replace(/,([^,]*)$/, ' &$1')}` :  
  hasArtists ? `Blending hits by ${artists.map(artist => artist.name).join(', ').replace(/,([^,]*)$/, ' &$1')} into one cohesive playlist` : null


  async function handleCreatePlaylist(e){
    e.preventDefault()
    const recURIs = allRecs.map(track => track.uri)
    const maxTracks = 100

    const uriChunks = []

    for(let i = 0; i < recURIs.length; i+= maxTracks){
      uriChunks.push(recURIs.slice(i, i + maxTracks))
    }

    const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": `application/json`,
      },
      body: JSON.stringify({
        name: playlistName,
        description: playlistDescription,
        public: false,
      })
    })

    const playlist = await response.json()
    const playlistID = playlist.id

    for(let uris of uriChunks){
      await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ uris })
      })
    }

    window.open(playlist.uri, "_blank")
  }

  function handlePreviewPlay(e, index, previewURL){
    // const audioPlayer = document.querySelector('.react-audio-player')
    setCurrentPreview(previewURL)
    setPreviewPlaying((prevState) => ({
      ...prevState,
      [index]: true,
    }))
  }

  function handlePreviewPause(e, index){
    setCurrentPreview('')
    setPreviewPlaying((prevState) => ({
      ...prevState,
      [index]: false
    }))
  }
  
  return (
    <>
    <button className="button" onClick={() => dispatch(togglePlaylistOpen(!playlistOpen))}>{playlistOpen ? "Close" : 'Open'}  Playlist</button>
    <Transition.Root show={playlistOpen}>
    <Dialog as="div" className="relative z-10" onClose={() => dispatch(togglePlaylistOpen(!playlistOpen))}>
    <Transition.Child
      as={Fragment}
      enter="ease-in-out duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in-out duration-500"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
    </Transition.Child>
    <div className="relative inset-0">
      <div className="absolute inset-0">
        <div className="overflow-y-scroll fixed inset-y-0 right-0 max-w- pl-10">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="pointer-events-auto relative w-screen max-w-lg">
              <div className="flex overflow-y-scroll min-h-content flex-col bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                    <p>{playlistName}</p>
                    <button className="button" onClick={handleCreatePlaylist}>
                      Export to Spotify
                    </button>
                    <button className="button" onClick={(e) => refreshTracks(e)}>
                    Reload Tracks
                    </button>
                  </Dialog.Title>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-scroll">
                  {playlistLoading && 
                  <p>Loading...</p>
                  }
                  {allRecs && allRecs.map((song, index) => {
                    return (
                      <div key={`${song.id}-${index}`} className="resultContainer flex-wrap">
                        {song.album.images[1] && <img className="max-w-[100px] max-h-[100px] flex-none" src={song.album.images[1].url} alt={song.album.name} />}
                        <div className="flex-1">
                        <p>{song.explicit && <span className="explicit"><BsExplicit className="inline-block mb-1 text-red-300 font-bold" /></span>} {song.name}</p>
                        <p><span className="artist">{song.artists[0].name}</span> - <span className="album">{song.album.name}</span></p>
                        <div className="previewContainer">
                        {song.preview_url && 
                        <button
                        className="font-bold text-orange"
                        onMouseOver={(e) => handlePreviewPlay(e, index, song.preview_url)}
                        onMouseOut={(e) => handlePreviewPause(e, index)}
                        onFocus={(e) => handlePreviewPlay(e, index, song.preview_url)}
                        onBlur={(e) => handlePreviewPause(e, index)}
                        >
                        {previewPlaying[index]? "Preview Playing" : "Preview Track"}
                        </button>
                        }
                        <button
                        className="block text-green font-bold hover:text-[#1FC7AB]"
                        onClick={()=> window.open(song.uri, '_blank')}>
                          Listen on Spotify
                        </button>
                        </div>
                        </div>
                        <p className="duration ml-auto mr-4">{`${Math.floor(song.duration_ms / 1000 / 60 << 0).toString()}:${Math.trunc(song.duration_ms / 1000 % 60).toString().padStart(2, '0')}`}</p>
                      </div>
                    )
                  })}
                  <ReactAudioPlayer
                  src={currentPreview}
                  autoPlay
                  />
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </div>
  </Dialog>
</Transition.Root>
    </>
  )
}
