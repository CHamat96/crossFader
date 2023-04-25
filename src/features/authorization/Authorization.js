import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, fetchTopArtists } from '../user/userSlice';
import { FaSpotify } from 'react-icons/fa'
import { setIsLoggedIn, setAccessToken, loggedIn } from './authorizationSlice';
import { getAuthorizeHref } from '../../utils/configAuth';
import { getHashParams, removeHashParams } from '../../utils/getHash';

const hashParams = getHashParams();
const access_token = hashParams.access_token;
removeHashParams();

export function Authentication(){
  const isLoggedIn = useSelector(loggedIn)
  const dispatch = useDispatch()

  useEffect(() => {
    if(access_token){
      dispatch(setIsLoggedIn(true))
      dispatch(setAccessToken(access_token))
      dispatch(fetchTopArtists(access_token))
      dispatch(fetchUser(access_token))
    }
  }, [dispatch])

  return (
    <>
    {!isLoggedIn && (
      <div className="bg-blue-50 text-black border-solid border-4 border-blue-900 max-w-md my-0 mx-auto p-5 flex flex-col items-center gap-6">
        <FaSpotify 
        className="text-[4rem] text-green"/>
        <p className="text-base text-center">Welcome! <br /> Please login with Spotify to continue</p>
        <button
        className="font-accent text-xl p-2.5 rounded-xl border-white border-solid border-2 text-white bg-green sm:text-2xl"
        aria-label="Login with Spotify"
        onClick={() => window.open(getAuthorizeHref(), '_self')}>Connect to Spotify</button>
      </div>
    )}
    </>
  )
}