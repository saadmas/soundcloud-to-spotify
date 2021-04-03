import * as React from "react";
import * as URLParse from "url-parse";
const { useState, useEffect } = React;

import Converter from "./Components/Converter/MultiTrackConverter/MultiTrackConverter";
import Header from "./Components/Header/Header";

import './App.css';
import { ConversionType } from "./types";
import MultiTrackConverter from "./Components/Converter/MultiTrackConverter/MultiTrackConverter";
import { tryGetConversionTypeFromUrl } from "./Components/Converter/utils/url";

const App = () => {
  const [conversionType, setConversionType] = useState<ConversionType | undefined>(undefined);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab?.url) {
        return;
      }
      const parsedUrl = new URLParse(currentTab.url);
      setConversionType(tryGetConversionTypeFromUrl(parsedUrl));
    }); 
  }, []);

  const renderAppContent = (): JSX.Element => {
    switch (conversionType) {
      case 'playlist':
      case 'likes':
        return <MultiTrackConverter conversionType={conversionType} />;
      case 'track':
        return <div>TODO: Track converter</div>;
      default:
        return <div className="openSoundCloud">To use this extension, open a SoundCloud playlist, album, or your Likes.</div>;
    }
  };

  return (
    <div className="app">
      <Header/>
      {renderAppContent()}
    </div>
  );
};

export default App;

