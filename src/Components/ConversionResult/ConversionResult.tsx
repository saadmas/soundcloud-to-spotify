import * as React from 'react';
import ErrorBar from '../ErrorBar/ErrorBar';
import SuccessBar from '../SuccessBar/SuccessBar';

import './ConversionResult.css';

export type ConversionOutcome = 'pending' | 'success' | 'fail';

interface ConversionResultProps {
  conversionOutcome: ConversionOutcome;
}

const ConversionResult = ({ conversionOutcome }: ConversionResultProps) => {
  const renderConversionResult = () => {
    switch (conversionOutcome) {
      case 'pending':
        return null;
      case 'success':
        const successMessage = `Succesfully added the track to your Spotify Liked Songss! Check it out in the Spotify app.`;
        return <SuccessBar successMessage={successMessage} />;
      case 'fail':
        const errorMessage = `Sorry, the track was not found on Spotify. This might be because the track is\
        labelled differently on Spotify and SoundCloud. You could try searching for the tracks directly in the Spotify app.`;
        return <ErrorBar errorMessage={errorMessage} />;
    }
  };

  return (
    <div className="conversionResult">
      {renderConversionResult()}
    </div>
  );
};

export default ConversionResult;