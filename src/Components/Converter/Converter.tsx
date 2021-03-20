import * as React from 'react';
const { useState } = React;
import MuiAlert from '@material-ui/lab/Alert';

import { ConversionType, Message } from '../../types';
import './Converter.css';
import Loader from '../Loader/Loader';
import ConversionPrompt from '../ConversionPrompt/ConversionPrompt';
import { withStyles } from '@material-ui/core/styles';
import { getSpotifyTrackIds, LOGIN_FAIL_ERROR } from './utils/track';
import SpotifyWebApi from 'spotify-web-api-js';

interface ConverterProps {
  conversionType: ConversionType;
}

const Converter = ({ conversionType }: ConverterProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

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
        // const { spotifyTrackIds, missingTracks, hasError } = await getSpotifyTrackIds([response.tracks[0]], spotifyApi); /// revert to full arr
        break;
    }
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
      return <Loader />;
    }
    return (
      <ConversionPrompt
        onConvertClick={onConvertClick}
        conversionType={conversionType}
      />
    );
  };

  const renderErrorBar = () => {
    if (!errorMessage) {
      return null;
    }

    const Alert = withStyles({
      root: {
        fontSize: 12
      },
    })(MuiAlert);

    return (
      <Alert
        severity="error"
        elevation={6}
        variant="filled"
      >
        {errorMessage}
      </Alert>
    );
  };
  

  return (
    <div className="converter">
      {renderErrorBar()}
      {renderConverterContent()}
    </div>
  );
};

export default Converter;