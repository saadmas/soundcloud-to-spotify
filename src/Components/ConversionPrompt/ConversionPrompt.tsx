import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { getConversionPromptText } from '../../Helpers/conversion';
import { ConversionType } from '../../types';

interface ConversionPromptProps {
  onConvertClick: () => void;
  conversionType: ConversionType;
}

const ConversionPrompt = ({ onConvertClick, conversionType }: ConversionPromptProps) => {
  const renderConvertButton = () => {
    const ConvertButton = withStyles({
      root: {
        textTransform: 'none',
        fontSize: 14,
        backgroundColor: '#fff',
        height: 40,
        width: 200,
        '&:hover': {
          opacity: 0.5,
          backgroundColor: '#fff',
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

  };

  return (
    <div>
      {renderConversionPrompt()}
    </div>
  )


};

export default ConversionPrompt;