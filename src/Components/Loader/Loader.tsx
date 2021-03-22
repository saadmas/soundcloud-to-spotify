import * as React from 'react';

import './Loader.css';

export const AddingToSpotifyPlaylistMessage = '';

interface LoaderProps {
  loadingMessage: string;
}

const Loader = ({ loadingMessage }: LoaderProps) => {
  return (
    <div className="loader">
      <div className="lds-ripple"><div></div><div></div></div>
      <div className="loadingMessage">{loadingMessage}</div>
    </div>
  );
};

export default Loader;