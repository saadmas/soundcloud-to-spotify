import * as React from 'react';
const { useState } = React;
import Button from '@material-ui/core/Button';

import { AUTH_FAIL, AUTH_SUCCESS, LOGIN, Message } from '../../types';

import './Converter.css';

const LOGIN_FAIL_ERROR = 'There was an error connecting to your Spotify account. Please try again.'

interface ConverterProps {
  soundCloudPath: string;
}

const Converter = ({ soundCloudPath }: ConverterProps) => {
  /// render Auth Fail error bar
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [spotifyToken, setSpotifyToken] = useState<string>('');

  const onSpotifyConnect = (message: Message) => {
    const { type, payload } = message;
    switch (type) {
      case AUTH_FAIL:
        setErrorMessage(LOGIN_FAIL_ERROR);
        break;
      case AUTH_SUCCESS:
        if (payload) {
          setSpotifyToken(payload);
          convertToSpotify(payload);
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
  };

  const onConvertClick = () => {
    if (!spotifyToken) {
      chrome.runtime.sendMessage({ type: LOGIN }, onSpotifyConnect);
      return;
    }
    convertToSpotify();
  };

  return (
    <div className="login">
      <Button className="loginButton" onClick={onConvertClick}>
        Connect to Spotify
      </Button>
  </div>
  );
};

export default Converter;