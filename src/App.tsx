import * as React from "react";
import Converter from "./Components/Converter/Converter";
const { useState } = React;

import Login from "./Components/Login/Login";
import './App.css';

const App = () => {
  const [token, setToken] = useState<string>('');

  return (
    <div className="app">
      <header className="header">
        SoundCloud to Spotify
      </header>
      {token ? <Converter /> : <Login />}
    </div>
  );
};

export default App;
