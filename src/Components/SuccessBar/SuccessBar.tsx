import { withStyles } from '@material-ui/core';
import * as React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

interface SuccessBarProps {
  successMessage: string;
}

const SuccessBar = ({ successMessage }: SuccessBarProps) => {
  const Alert = withStyles({
    root: {
      fontSize: '13px'
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