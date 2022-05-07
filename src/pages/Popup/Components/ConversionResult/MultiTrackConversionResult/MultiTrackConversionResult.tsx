import * as React from 'react';
import { Track } from '../../../../types';
import ErrorBar from '../../ErrorBar/ErrorBar';
import SuccessBar from '../../SuccessBar/SuccessBar';
import { ConversionOutcome } from '../ConversionResult';

import './MultiTrackConversionResult.css';

export interface ConversionResultState {
  missingTracks?: Track[];
  conversionOutcome: ConversionOutcome;
}

interface MultiTrackConversionResultProps {
  conversionResult: ConversionResultState;
  conversionType: 'playlist' | 'likes';
}

const MultiTrackConversionResult = ({
  conversionResult,
  conversionType,
}: MultiTrackConversionResultProps) => {
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

    const missingTrackElements = missingTracks.map((track) => (
      <li className="missingTrackListItem">
        <span className="missingTrackArtist">{`${track.artist} - `}</span>
        <span className="missingTrackName">{track.name}</span>
      </li>
    ));

    return (
      <div className="missingTracksResult">
        <ErrorBar
          errorMessage={
            'However, the following tracks were not found on Spotify.'
          }
        />
        <div className="extraErrorInfo">
          This might be because they are labelled differently between Spotify
          and SoundCloud. You could try searching for these tracks directly in
          the Spotify app.
        </div>
        <ul className="missingTracksList">{missingTrackElements}</ul>
      </div>
    );
  };

  const renderResultForPlaylistConversion = () => {
    return (
      <div className="multiTrackConversionResult">
        <SuccessBar
          successMessage={
            'Succesfully converted your Spotify playlist! Check it out in the Spotify app.'
          }
        />
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
              This might be because they are labelled differently between
              Spotify and SoundCloud. You could try searching for the tracks
              directly in the Spotify app.
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderConversionFail = () => {
    return (
      <div className="multiTrackConversionResult">
        <span>Sorry! </span>
        {getConversionFailTextForConversionType()}
      </div>
    );
  };

  const renderConversionResult = () => {
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

export default MultiTrackConversionResult;
