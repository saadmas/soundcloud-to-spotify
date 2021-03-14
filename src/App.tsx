import * as React from "react";
import * as URLParse from "url-parse";
const { useState, useEffect } = React;

import Converter from "./Components/Converter/Converter";
import Header from "./Components/Header/Header";

import './App.css';

const App = () => {
  const [soundCloudPath, setSoundCloudPath] = useState<string>('');
 
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab?.url) {
        return;
      }

      const url = new URLParse(currentTab.url);
      const { hostname, pathname } = url; /// match on path as well

      if (hostname.includes('soundcloud.com')) {
        setSoundCloudPath(pathname);
      }
    }); 
  }, []);

  const renderAppContent = (): JSX.Element => {
    return soundCloudPath ?
      <Converter soundCloudPath={soundCloudPath}/> :
      <div className="visitSoundCloud">Please visit SoundCloud to use this extension.</div>;
  };

  return (
    <div className="app">
      <Header/>
      {renderAppContent()}
    </div>
  );
};

export default App;
