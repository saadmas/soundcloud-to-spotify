import { withStyles } from '@material-ui/core';
import * as React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

interface ErrorBarProps {
  onErrorDismiss?: () => void;
  errorMessage?: string;
  styles?: React.CSSProperties;
}

const ErrorBar = ({ onErrorDismiss, errorMessage, styles }: ErrorBarProps) => {
  if (!errorMessage) {
    return null;
  }

  const Alert = withStyles({
    root: {
      fontSize: '13px'
    }
  })(MuiAlert);

  return (
    <div style={styles}>
      <Alert
        severity="error"
        elevation={6}
        variant="filled"
        onClose={onErrorDismiss}
      >
        {errorMessage}
      </Alert>
    </div>
  );
};

export default ErrorBar;