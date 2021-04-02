import { LinearProgress, withStyles } from '@material-ui/core';
import * as React from 'react';

import './Loader.css';

export const AddingToSpotifyPlaylistMessage = '';

interface LoaderProps {
  loadingMessage: string;
  loadingProgress?: number;
}

const LoadingProgressBar = withStyles({
  root: {
    width: '400px',
    background: 'white'
  },
  barColorPrimary: {
    background: 'linear-gradient(90deg, rgba(255,107,0,1) 45%, rgba(29,185,84,1) 70%)'
  }
})(LinearProgress);

const Loader = ({ loadingMessage, loadingProgress }: LoaderProps) => {
  const renderLoadingProgress = () => (
    <div className="loadingProgress">
      <LoadingProgressBar variant="determinate" value={loadingProgress} />
      <span className="loadingPercent">{`${loadingProgress}%`}</span>
    </div>
  );

  return (
    <div className="loader">
      <div className="lds-ripple"><div></div><div></div></div>
      {loadingProgress !== undefined && renderLoadingProgress()}
      <div className="loadingMessage">{loadingMessage}</div>
    </div>
  );
};

export default Loader;