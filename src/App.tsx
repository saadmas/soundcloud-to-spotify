import * as React from "react";
import * as URLParse from "url-parse";
const { useState, useEffect } = React;

import Converter from "./Components/Converter/Converter";
import Login from "./Components/Login/Login";
import Header from "./Components/Header/Header";

import './App.css';

const App = () => {
  const [token, setToken] = useState<string>('');
  const [isSoundCloudTab, setSoundCloudTab] = useState<boolean>(false);
 
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      console.log(currentTab?.url)
      if (!currentTab?.url) {
        return;
      }
      const url = new URLParse(currentTab.url);
      const { hostname, pathname } = url; /// match on path as well
      if (hostname.includes('soundcloud.com')) {
        setSoundCloudTab(true)
        return;
      }
    }); 
  }, []);

  const renderAppContent = (): JSX.Element => {
    if (isSoundCloudTab) {
      return token ? <Converter /> : <Login setToken={setToken} />;
    }
    return <div className="visitSoundCloud">Please visit SoundCloud to use this extension.</div>;
  };

  return (
    <div className="app">
      <Header/>
      {renderAppContent()}
    </div>
  );
};

export default App;
