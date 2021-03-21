import * as React from 'react';
import { render } from 'react-dom';
import { ConversionType, Track } from '../../types';

import './ConversionResult.css';

type ConversioOutcome = 'pending' | 'success' | 'fail';

export interface ConversionResultState {
  missingTracks?: Track[];
  conversionOutcome: ConversioOutcome;
}

interface ConversionResultProps {
  conversionResult: ConversionResultState;
  conversionType: ConversionType;
}

const ConversionResult = ({ conversionResult, conversionType }: ConversionResultProps) => {
  const { conversionOutcome, missingTracks } = conversionResult;

  const renderResultForConversionType = () => {
    switch (conversionType) {
      case 'playlist':
        return renderResultForPlaylistConversion();
      default:
        return null;
    }
  };

  const renderMissingTracksResult = () => {
    if (!missingTracks?.length) {
      return null;
    }

    const missingTrackElements = missingTracks.map(track => (
      <li className="missingTrackListItem">
        <span className="missingTrackArtist">{`${track.artist} - `}</span>
        <span className="missingTrackName">{track.name}</span>
      </li>
    ));

    return (
      <div className="missingTracksResult">
        <div>
          However, the following tracks were not found on Spotify. 
          This might be because they are labelled differently on Spotify and SoundCloud.
          You could try searching for these tracks directly in the Spotify app.
        </div>
        <ul className="missingTracksList">
          {missingTrackElements}
        </ul>
      </div>
    );
  };
  
  const renderResultForPlaylistConversion = () => {
    return (
      <div className="conversionResult">
        <div> 
          Succesfully converted your Spotify playlist!  Check it out in the Spotify app.
        </div>
        {renderMissingTracksResult()}
      </div>
    );
  };

  const getConversionFailTextForConversionType = () => {
    switch (conversionType) {
      case 'playlist':
        return (
          <>
            <span>
              None of the tracks in the playlist were found on Spotify.
            </span>
            <div className="directSearchPrompt">
              This might be because they are labelled differently on Spotify and SoundCloud.
              You could try searching for the tracks directly in the Spotify app.
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderConversionFail = () => {
    return (
      <div className="conversionResult">
        <span>Yikes! </span>
        {getConversionFailTextForConversionType()}
      </div>
    );
  };

  const renderConversionResult = () => {
    return renderConversionFail();
    switch (conversionOutcome) {
      case 'pending':
        return null;
      case 'success':
        return renderResultForConversionType();
      case 'fail':
        return renderConversionFail();
    }
  };

  return renderConversionResult();
};

export default ConversionResult;