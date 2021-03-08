import * as React from "react";
import Converter from "./Components/Converter/Converter";
const { useState } = React;

import Login from "./Components/Login/Login";

const App = () => {
  const [token, setToken] = useState<string>('');

  return (
    <div className="App">
      <header>
        SoundCloud to Spotify
      </header>
      { token ? <Login /> : <Converter />}
    </div>
  );
};

export default App;
