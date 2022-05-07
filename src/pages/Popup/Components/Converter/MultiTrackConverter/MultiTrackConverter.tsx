import * as React from 'react';
const { useState, useEffect } = React;

import { Message, SpotifyApiType, Track } from '../../../../types';
import './MultiTrackConverter.css';
import Loader from '../../Loader/Loader';
import ConversionPrompt from '../../ConversionPrompt/ConversionPrompt';
import {
  CONVERT_PLAYLIST_ERROR,
  getSpotifyTrackId,
  LOGIN_FAIL_ERROR,
  SpotifyTrackSearchResult,
} from '../utils/track';
import SpotifyWebApi from 'spotify-web-api-js';
import { addTracksToPlaylist } from '../utils/playlist';
import MultiTrackConversionResult, {
  ConversionResultState,
} from '../../ConversionResult/MultiTrackConversionResult/MultiTrackConversionResult';
import ErrorBar from '../../ErrorBar/ErrorBar';
import { tryGetRetryAfter } from '../utils/networkRequest';

interface MultiTrackConverterProps {
  conversionType: 'playlist' | 'likes';
}

const MultiTrackConverter = ({ conversionType }: MultiTrackConverterProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number | undefined>(
    undefined
  );
  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [conversionResultState, setConversionResultState] =
    useState<ConversionResultState>({
      missingTracks: [],
      conversionOutcome: 'pending',
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
        } else {
          setErrorMessage(LOGIN_FAIL_ERROR);
        }
        break;
      default:
        break;
    }
  };

  const getConversionMessage = (): Message => {
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
        setLoadingMessage('Collecting all tracks in the SoundCloud playlist');
      }

      chrome.tabs.sendMessage(
        currentTabId,
        getConversionMessage(),
        (response) => onResponseFromContentScript(response, authToken)
      );
    });
  };

  const onResponseFromContentScript = async (
    response: Message,
    authToken: string
  ) => {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(authToken);
    switch (response.type) {
      case 'CONVERT PLAYLIST':
        setLoadingMessage('Adding tracks to Spotify playlist');
        const { tracks, name } = response;

        const {
          spotifyTrackIds,
          missingTracks,
          hasError: hasSearchError,
        } = await getSpotifyTrackIds(tracks, spotifyApi);
        console.log('GOT TRACK IDS!!!');
        console.log(spotifyTrackIds);
        console.log('missing tracks');
        console.log(missingTracks);
        if (hasSearchError) {
          handlePlaylistConvertError();
          break;
        }

        const areAllTracksMissing = tracks.length === missingTracks.length;
        if (areAllTracksMissing) {
          setConversionResultState({
            missingTracks,
            conversionOutcome: 'fail',
          });
          break;
        }

        const { hasError: hasAddToPlaylistError } = await addTracksToPlaylist(
          spotifyTrackIds,
          name,
          spotifyApi
        );
        if (hasAddToPlaylistError) {
          handlePlaylistConvertError();
          break;
        }

        setConversionResultState({
          missingTracks,
          conversionOutcome: getPlaylistConversionOutcome(
            tracks.length,
            missingTracks.length
          ),
        });
        break;
    }
    setLoading(false);
    setLoadingMessage('');
  };

  const getSpotifyTrackIds = async (
    tracks: Track[],
    spotifyApi: SpotifyApiType
  ): Promise<SpotifyTrackSearchResult> => {
    const spotifyTrackIds: string[] = [];
    const missingTracks: Track[] = [];
    let hasError = false;
    let index = 0;

    while (index < tracks.length) {
      try {
        const track = tracks[index];
        index++;

        const trackId = await getSpotifyTrackId(track, spotifyApi);

        /// might have to change based on how long adding tracks to playlist takes
        const percentDone = Math.round(((index - 1) / tracks.length) * 100);
        setLoadingProgress(percentDone);

        if (trackId === undefined) {
          missingTracks.push(track);
          continue;
        }

        spotifyTrackIds.push(trackId);
      } catch (e) {
        const retryAfter = tryGetRetryAfter(e);
        if (!Number.isNaN(retryAfter)) {
          index--;
          await new Promise((r) => setTimeout(r, retryAfter + 1));
        } else {
          console.log(e);
          hasError = true;
        }
      }
    }

    return { spotifyTrackIds, missingTracks, hasError };
  };

  const getPlaylistConversionOutcome = (
    trackCount: number,
    missingTrackCount: number
  ) => {
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
      return (
        <Loader
          loadingMessage={loadingMessage}
          loadingProgress={loadingProgress}
        />
      );
    }

    const { conversionOutcome } = conversionResultState;
    if (conversionOutcome !== 'pending') {
      return (
        <MultiTrackConversionResult
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
        styles={{ marginBottom: '10px', width: '98%' }}
      />
      {renderConverterContent()}
    </div>
  );
};

export default MultiTrackConverter;
