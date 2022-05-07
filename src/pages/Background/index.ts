import URLParse from 'url-parse';
import { Message } from '../types';

chrome.runtime.onMessage.addListener(chromeMessageHandler);

function chromeMessageHandler(
  message: Message,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) {
  switch (message.type) {
    case 'LOGIN':
      const STATE = encodeURIComponent(
        'meet' + Math.random().toString(36).substring(2, 15)
      );
      chrome.identity.launchWebAuthFlow(
        { url: getSpotifyAuthUrl(STATE), interactive: true },
        (redirectUrl) => onAuthRedirect(sendResponse, STATE, redirectUrl)
      );
      break;
    default:
      break;
  }
  return true;
}

function getSpotifyAuthUrl(state: string): string {
  const clientId = 'f5a2c30e102140d0970820bcd154dba8';
  const responseType = encodeURIComponent('token');
  const redirectUri = encodeURIComponent(
    'https://eplmffohmkeaplkdidbgjoeocnkfhdgj.chromiumapp.org/'
  );
  const scope = encodeURIComponent(
    [
      'user-read-email',
      'playlist-modify-private',
      'user-library-modify',
      'user-read-private',
    ].join(' ')
  );

  const baseUrl = 'https://accounts.spotify.com/authorize';
  const queryString = `client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

  const spotifyAuthUrl = `${baseUrl}?${queryString}`;
  return spotifyAuthUrl;
}

function onAuthRedirect(
  sendResponse: (message?: Message) => void,
  state: string,
  redirectUrl?: string
) {
  if (!redirectUrl) {
    sendResponse({ type: 'AUTH FAIL' });
    return;
  }

  if (
    chrome.runtime.lastError ||
    redirectUrl.includes('callback?error=access_denied')
  ) {
    sendResponse({ type: 'AUTH FAIL' });
    return;
  }

  const parsedUrl = new URLParse(redirectUrl);
  const responseParameters = getResponseParametersFromHash(parsedUrl.hash);
  const accessToken = responseParameters.get('access_token');
  const responseState = responseParameters.get('state');

  if (state !== responseState || !accessToken) {
    sendResponse({ type: 'AUTH FAIL' });
    return;
  }

  sendResponse({ type: 'AUTH SUCCESS', token: accessToken });
}

function getResponseParametersFromHash(hash: string): Map<string, string> {
  const responseParamters = new Map<string, string>();
  const hashWithoutPoundPrefix = hash.substring(1);
  const responsePairs = hashWithoutPoundPrefix.split('&');

  for (const responsePair of responsePairs) {
    const [key, value] = responsePair.split('=');
    responseParamters.set(key, value);
  }

  return responseParamters;
}
