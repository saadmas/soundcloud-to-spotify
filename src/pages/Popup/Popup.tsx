import * as React from 'react';
import URLParse from 'url-parse';
const { useState, useEffect } = React;

import Converter from './Components/Converter/Converter';
import Header from './Components/Header/Header';

import './Popup.css';
import { ConversionType, Message } from '../types';
import MultiTrackConverter from './Components/Converter/MultiTrackConverter/MultiTrackConverter';
import { tryGetConversionTypeFromUrl } from './Components/Converter/utils/url';

const App = () => {
  const [conversionType, setConversionType] = useState<
    ConversionType | undefined
  >(undefined);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab?.url) {
        return;
      }

      const parsedUrl = new URLParse(currentTab.url);
      const conversionTypeFromUrl = tryGetConversionTypeFromUrl(parsedUrl);
      console.log(conversionTypeFromUrl);
      if (conversionTypeFromUrl) {
        setConversionType(conversionTypeFromUrl);
        return;
      }

      if (currentTab.id === undefined) {
        return;
      }

      const trygetTrackConversionTypeMessage: Message = {
        type: 'CHECK TRACK CONVERSION TYPE',
      };
      chrome.tabs.sendMessage(
        currentTab.id,
        trygetTrackConversionTypeMessage,
        (response) => {
          if (response?.type === 'TRACK PAGE CONFIRMED') {
            setConversionType('track');
          }
        }
      );
    });
  }, []);

  const renderAppContent = (): JSX.Element => {
    switch (conversionType) {
      case 'playlist':
      case 'likes':
        return <MultiTrackConverter conversionType={conversionType} />;
      case 'track':
        return <Converter />;
      default:
        return (
          <div className="openSoundCloud">
            To use this extension, open a SoundCloud playlist, album, track or
            your Likes.
          </div>
        );
    }
  };

  return (
    <div className="app">
      <Header />
      {renderAppContent()}
    </div>
  );
};

export default App;
