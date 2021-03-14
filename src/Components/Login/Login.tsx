import * as React from 'react';
const { useState } = React;
import Button from '@material-ui/core/Button';

import { AUTH_FAIL, AUTH_SUCCESS, LOGIN, Message } from '../../types';

import './Login.css';

interface LoginProps {
  setToken: (token: string) => void;
}

const Login = ({ setToken }: LoginProps) => {
  const [hasLoginFailed, setLoginFailed] = useState<boolean>(false);
  /// render Auth Fail error bar

  const handleAuth = (message: Message) => {
    const { type, payload } = message;
    switch (type) {
      case AUTH_FAIL:
        setLoginFailed(true);
        break;
      case AUTH_SUCCESS:
        if (payload) {
          setToken(payload);
        }
        else {
          setLoginFailed(true);
        }
        break;
      default:
        break;
    }
  };

  const connectToSpotify = () => {
    chrome.runtime.sendMessage({ type: LOGIN }, handleAuth);
  };

  return (
    <div className="login">
      <Button className="loginButton" onClick={connectToSpotify}>
        Connect to Spotify
      </Button>
  </div>
  );
};

export default Login;