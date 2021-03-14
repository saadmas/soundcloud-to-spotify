import * as React from 'react';
const { useState } = React;
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { AUTH_FAIL, AUTH_SUCCESS, GET_PLAYLIST, LOGIN, Message } from '../../types';
import { getConversionPrompt } from '../../Helpers/conversion';

import './Converter.css';
import Loader from '../Loader/Loader';

const LOGIN_FAIL_ERROR = 'There was an error connecting to your Spotify account. Please try again.'

interface ConverterProps {
  soundCloudPath: string;
}

const Converter = ({ soundCloudPath }: ConverterProps) => {
  /// render Auth Fail error bar
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  const onSpotifyConnect = (message: Message) => {
    const { type } = message;
    switch (type) {
      case AUTH_FAIL:
        setErrorMessage(LOGIN_FAIL_ERROR);
        break;
      case AUTH_SUCCESS:
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

  const getConversionType = (): string => {
    return GET_PLAYLIST;
  };

  const convertToSpotify = (token?: string) => {
    const authToken = token ?? spotifyToken;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTabId = tabs[0]?.id;
      if (currentTabId === undefined) {
        return;
      }
      chrome.tabs.sendMessage(currentTabId, { type: getConversionType() }, (response) => {
        console.log(response);
      });
    });
  };

  const onConvertClick = () => {
    setLoading(true);
    if (!spotifyToken) {
      chrome.runtime.sendMessage({ type: LOGIN }, onSpotifyConnect);
      return;
    }
    convertToSpotify();
  };

 

  const renderConvertButton = () => {
    if (isLoading) {
      return null;
    }

    const ConvertButton = withStyles({
      root: {
        textTransform: 'none',
        fontSize: 14,
        backgroundColor: '#fff',
        height: 40,
        width: 200,
        '&:hover': {
          opacity: 0.5,
          backgroundColor: '#fff',
        },
      },
    })(Button);
    
    return (
      <ConvertButton onClick={onConvertClick}>
        {getConversionPrompt(soundCloudPath)}
      </ConvertButton>
    );
  };

  return (
    <div className="converter">
      {renderConvertButton()}
      {isLoading && <Loader />}
    </div>
  );
};

export default Converter;