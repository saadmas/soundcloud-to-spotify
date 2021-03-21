import { withStyles } from '@material-ui/core';
import * as React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

interface ErrorBarProps {
  onErrorDismiss: () => void;
  errorMessage?: string;
}

const ErrorBar = ({ onErrorDismiss, errorMessage }: ErrorBarProps) => {
  if (!errorMessage) {
    return null;
  }

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
      severity="error"
      elevation={6}
      variant="filled"
      onClose={onErrorDismiss}
    >
      {errorMessage}
    </Alert>
  );
};

export default ErrorBar;