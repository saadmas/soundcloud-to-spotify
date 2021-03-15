import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { ConversionType } from '../../types';

interface ConversionPromptProps {
  onConvertClick: () => void;
  conversionType: ConversionType;
}

const ConversionPrompt = ({ onConvertClick, conversionType }: ConversionPromptProps) => {
  const getConvertButton = () => {
    const ConvertButton = withStyles({
      root: {
        textTransform: 'none',
        fontSize: 14,
        backgroundColor: 'rgba(29,185,84,1)',
        color: '#fff',
        height: 40,
        width: 200,
        '&:hover': {
          opacity: 0.9,
          backgroundColor: 'rgba(29,185,84,1)',
          color: '#fff',
        },
      },
    })(Button);
    
    return (
      <ConvertButton onClick={onConvertClick}>
        {getConversionPromptText(conversionType)}
      </ConvertButton>
    );
  };

  const renderConversionPrompt = () => {
    switch (conversionType) {
      case 'playlist':
        return getConvertButton();
      default:
        return null;
    }
  };

  return (
    <div>
      {renderConversionPrompt()}
    </div>
  );
};

export default ConversionPrompt;

function getConversionPromptText(conversionType: ConversionType): string {
  switch (conversionType) {
    case 'playlist':
      return 'Convert to Spotify playlist';
    default:
      return ''
  }
}