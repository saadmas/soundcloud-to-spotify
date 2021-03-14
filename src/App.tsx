import * as React from "react";
import * as URLParse from "url-parse";
const { useState, useEffect } = React;

import Converter from "./Components/Converter/Converter";
import Header from "./Components/Header/Header";

import './App.css';
import { ConversionType } from "./types";
import { tryGetConversionTypeFromUrl } from "./Helpers/conversion";

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
    return conversionType ?
      <Converter conversionType={conversionType}/> :
      <div className="openSoundCloud">Please open a SoundCloud playlist or album to use this extension.</div>;
  };

  return (
    <div className="app">
      <Header/>
      {renderAppContent()}
    </div>
  );
};

export default App;
