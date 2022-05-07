import * as React from 'react';
import SpotifyIcon from '../../../../assets/img/spotify-icon.png';
import SoundCloudIcon from '../../../../assets/img/soundcloud-icon.png';

import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <img src={SoundCloudIcon} className="appIcon" />
      <span>SoundCloud to Spotify</span>
      <img src={SpotifyIcon} className="appIcon" />
    </header>
  );
};

export default Header;
