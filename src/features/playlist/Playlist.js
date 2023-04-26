import { Fragment, useState } from "react";
import { selectAllRecs, revertRecs, isPlaylistLoading } from "./playlistSlice";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { CiCircleRemove } from 'react-icons/ci'
import { TbVinyl } from "react-icons/tb";
import { selectUserID } from "../user/userSlice";
import { accessToken } from "../authorization/authorizationSlice";
import { allSelectedArtists, areArtistsSelected } from "../search/artistSearchSlice";
import { isAlbumSelected, selectedAlbum } from "../search/albumSearchSlice";
export function PlaylistDisplay(){
  const [open, setOpen] = useState(true)
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
  return (
    <>
    {playlistLoading === false && <button className="button" onClick={() => setOpen(!open)}>{open ? "Close" : 'Open'}  Playlist</button>}
    <Transition.Root show={open}>
    <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
        <div className="overflow-y-scroll fixed inset-y-0 right-0 max-w-full pl-10">
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
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute left-25 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                <button
                  type="button"
                  className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={() => setOpen(false)}
                >
                  <span>Close panel</span>
                  <CiCircleRemove />
                </button>
              </div>
            </Transition.Child>
              <div className="flex overflow-y-scroll h-content flex-col bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                    <p>{playlistName}</p>
                    <button className="button" onClick={handleCreatePlaylist}>
                      Export to Spotify
                    </button>
                  </Dialog.Title>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-scroll">
                  {allRecs.map((song, index) => {
                    return (
                      <div key={`${song.id}-${index}`} className="resultContainer">
                        {song.album.images[1] && <img className="w-[150px] h-[150px]" src={song.album.images[1].url} alt={song.album.name} />}
                        <div>
                        <p>{song.name}</p>
                        <p><span className="artist">{song.artists[0].name}</span> - <span className="album">{song.album.name}</span></p>
                        {song.preview_url && <p>Has Preview</p>}
                        </div>
                      </div>
                    )
                  })}
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
