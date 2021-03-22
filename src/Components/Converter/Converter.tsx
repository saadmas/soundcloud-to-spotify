import * as React from 'react';
const { useState, useEffect } = React;

import { ConversionType, Message } from '../../types';
import './Converter.css';
import Loader from '../Loader/Loader';
import ConversionPrompt from '../ConversionPrompt/ConversionPrompt';
import { CONVERT_PLAYLIST_ERROR, getSpotifyTrackIds, LOGIN_FAIL_ERROR } from './utils/track';
import SpotifyWebApi from 'spotify-web-api-js';
import { addTracksToPlaylist } from './utils/playlist';
import ConversionResult, { ConversionResultState } from '../ConversionResult/ConversionResult';
import ErrorBar from '../ErrorBar/ErrorBar';

interface ConverterProps {
  conversionType: ConversionType;
}

const Converter = ({ conversionType }: ConverterProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [conversionResultState, setConversionResultState] = useState<ConversionResultState>({
    missingTracks: [],
    conversionOutcome: 'pending'
  });

  useEffect(() => {
    if (errorMessage) {
      setLoading(false);
      setLoadingMessage('');
    }
  }, [errorMessage]);

  const onSpotifyConnect = (message: Message) => {
    const { type } = message;
    switch (type) {
      case 'AUTH FAIL':
        setErrorMessage(LOGIN_FAIL_ERROR);
        break;
      case 'AUTH SUCCESS':
        if ('token' in message) {
          setSpotifyToken(message.token);
          convertToSpotify(message.token);
        }
        else {
          setErrorMessage(LOGIN_FAIL_ERROR);
        }
        break;
      default:
        break;
    }
  };

  const getConversionMessage = (): Message => {
    console.log('conversionType') //*
    console.log(conversionType) 
    switch (conversionType) {
      case 'playlist':
      default:
        return { type: 'GET PLAYLIST' };
    }
  };

  const convertToSpotify = (token?: string) => {
    const authToken = token ?? spotifyToken;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTabId = tabs[0]?.id;
      if (currentTabId === undefined) {
        return;
      }

      if (conversionType === 'playlist') {
        setLoadingMessage('Collecting all tracks in the SoundCloud playlist')
      }

      chrome.tabs.sendMessage(
        currentTabId,
        getConversionMessage(),
        (response) => onResponseFromContentScript(response, authToken)
      );
    });
  };

  const onResponseFromContentScript = async (response: Message, authToken: string) => {
    console.log('response'); //*
    console.log(response);
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(authToken);
    switch (response.type) {
      case 'CONVERT PLAYLIST':
        setLoadingMessage('Adding tracks to Spotify playlist');
        const { tracks, name } = response;

        const { spotifyTrackIds, missingTracks, hasError: hasSearchError } = await getSpotifyTrackIds(tracks, spotifyApi);
        console.log('GOT TRACK IDS!!!')
        console.log(spotifyTrackIds)
        console.log('missing tracks')
        console.log(missingTracks)
        if (hasSearchError) {
          handlePlaylistConvertError();
          break;
        }

        const areAllTracksMissing = tracks.length === missingTracks.length;
        if (areAllTracksMissing) {
          setConversionResultState({
            missingTracks,
            conversionOutcome: 'fail'
          });
          break;
        }

        const { hasError: hasAddToPlaylistError } = await addTracksToPlaylist(spotifyTrackIds, name, spotifyApi);
        if (hasAddToPlaylistError) {
          handlePlaylistConvertError();
          break;
        }

        setConversionResultState({
          missingTracks,
          conversionOutcome: getPlaylistConversionOutcome(tracks.length, missingTracks.length)
        });
        break;
    }
    setLoading(false);
    setLoadingMessage('');
  };

  const getPlaylistConversionOutcome = (trackCount: number, missingTrackCount: number) => {
    return trackCount === missingTrackCount ? 'fail' : 'success';
  };

  const handlePlaylistConvertError = () => {
    setErrorMessage(CONVERT_PLAYLIST_ERROR);
  };

  const onConvertClick = () => {
    setLoading(true);
    
    if (!spotifyToken) {
      const loginMessage: Message = { type: 'LOGIN' };
      chrome.runtime.sendMessage(loginMessage, onSpotifyConnect);
      return;
    }
    
    convertToSpotify();
  };

  
  const renderConverterContent = () => {
    if (isLoading) {
      return <Loader loadingMessage={loadingMessage}/>;
    }

    const { conversionOutcome } = conversionResultState;
    if (conversionOutcome !== 'pending') {
      return (
        <ConversionResult
          conversionResult={conversionResultState}
          conversionType={conversionType}
        />
      );
    }
    
    return (
      <ConversionPrompt
        onConvertClick={onConvertClick}
        conversionType={conversionType}
      />
    );
  };

  const onErrorDismiss = () => {
    setErrorMessage('');
  };
  

  return (
    <div className="converter">
      <ErrorBar
        errorMessage={errorMessage}
        onErrorDismiss={onErrorDismiss}
      />
      {renderConverterContent()}
    </div>
  );
};

export default Converter;