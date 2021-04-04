import * as React from 'react';
const { useState, useEffect } = React;

import { Message, SpotifyApiType, Track } from '../../types';
import './Converter.css';
import Loader from '../Loader/Loader';
import ConversionPrompt from '../ConversionPrompt/ConversionPrompt';
import { CONVERT_TRACK_ERROR, getSpotifyTrackId, LOGIN_FAIL_ERROR, SpotifySingleTrackSearchResult } from './utils/track';
import SpotifyWebApi from 'spotify-web-api-js';
import ConversionResult, { ConversionOutcome } from '../ConversionResult/ConversionResult';
import ErrorBar from '../ErrorBar/ErrorBar';
import { tryGetRetryAfter } from './utils/networkRequest';
import { addTracksToLikedSongs } from './utils/likedSongs';

const Converter = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [conversionOutcome, setConversionOutcome] = useState<ConversionOutcome>('pending');

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

  const convertToSpotify = (token?: string) => {
    const authToken = token ?? spotifyToken;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTabId = tabs[0]?.id;
      if (currentTabId === undefined) {
        return;
      }

      const getTrackMessage: Message = { type: 'GET TRACK' };
      chrome.tabs.sendMessage(
        currentTabId,
        getTrackMessage,
        (response) => onResponseFromContentScript(response, authToken)
      );
    });
  };

  const onResponseFromContentScript = async (response: Message, authToken: string) => {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(authToken);

    if (response.type !== 'CONVERT TRACK') {
      return;
    }

    setLoadingMessage('Adding track to your Spotify Liked Songs');

    const { spotifyTrackId, hasError: hasSearchError } = await fetchSpotifyTrackId(response.track, spotifyApi);

    if (hasSearchError) {
      handleTrackConvertError();
      setLoading(false);
      setLoadingMessage('');
      return;
    }

    if (!spotifyTrackId) {
      setConversionOutcome('fail');
      stopLoading();
      return;
    }

    const { hasError: hasAddToLikedSongsError } = await addTracksToLikedSongs([spotifyTrackId], spotifyApi);
    if (hasAddToLikedSongsError) {
      handleTrackConvertError();
      stopLoading();
      return;
    }

    setConversionOutcome('success');
    stopLoading();
  };

  const stopLoading = () => {
    setLoading(false);
    setLoadingMessage('');
  };

  const handleTrackConvertError = () => {
    setErrorMessage(CONVERT_TRACK_ERROR);
  };

  const fetchSpotifyTrackId = async (
    track: Track,
    spotifyApi: SpotifyApiType
  ): Promise<SpotifySingleTrackSearchResult> => {
    let spotifyTrackId: string | undefined;
    let hasError = false;
  
    while (true) {
      try {
        spotifyTrackId = await getSpotifyTrackId(track, spotifyApi);
        break;
      } catch (e) {
        const retryAfter = tryGetRetryAfter(e);
        if (!Number.isNaN(retryAfter)) {
          await new Promise(r => setTimeout(r, retryAfter + 1));
        } else {
          console.log(e);
          hasError = true;
          break;
        }
      }
    }
  
    return { spotifyTrackId, hasError };
  }

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

    if (conversionOutcome !== 'pending') {
      return <ConversionResult conversionOutcome={conversionOutcome} />;
    }
    
    return (
      <ConversionPrompt
        onConvertClick={onConvertClick}
        conversionType={'track'}
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
        styles={{ marginBottom: '10px', width: '98%' }}
      />
      {renderConverterContent()}
    </div>
  );
};

export default Converter;