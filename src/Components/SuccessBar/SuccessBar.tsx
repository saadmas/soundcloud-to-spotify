import { withStyles } from '@material-ui/core';
import * as React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

interface SuccessBarProps {
  successMessage: string;
}

const SuccessBar = ({ successMessage }: SuccessBarProps) => {
  const Alert = withStyles({
    root: {
      fontSize: '12px',
      position: 'absolute',
      top: '0',
      height: '35px',
      width: '100%',
      borderRadius: 0,
    },
    icon: {
      padding: '6px',
      marginRight: '0px'
    },
    action: {
      margin: '0px',
      marginBottom: '2px'
    }
  })(MuiAlert);

  return (
    <Alert
      severity="success"
      elevation={6}
      variant="filled"
    >
      {successMessage}
    </Alert>
  );
};

export default SuccessBar;