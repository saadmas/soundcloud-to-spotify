import * as React from 'react';
const { useState } = React;

import { AUTH_FAIL, AUTH_SUCCESS, ConversionType, GET_PLAYLIST, LOGIN, Message } from '../../types';
import './Converter.css';
import Loader from '../Loader/Loader';
import ConversionPrompt from '../ConversionPrompt/ConversionPrompt';

const LOGIN_FAIL_ERROR = 'There was an error connecting to your Spotify account. Please try again.'

interface ConverterProps {
  conversionType: ConversionType;
}

const Converter = ({ conversionType }: ConverterProps) => {
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

  

  return (
    <div className="converter">
      {renderConverterContent()}
    </div>
  );
};

export default Converter;