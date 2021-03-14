import { AUTH_FAIL, AUTH_SUCCESS, LOGIN, Message } from "./types";
import * as URLParse from 'url-parse';

let STATE = '';

chrome.runtime.onMessage.addListener(chromeMessageHandler);

function getSpotifyAuthUrl(): string {
  STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
  const CLIENT_ID = 'f5a2c30e102140d0970820bcd154dba8';
  const RESPONSE_TYPE = encodeURIComponent('token');
  const REDIRECT_URI = encodeURIComponent('https://opdbejkeklgoefcmfeaehnnhpnnnnpii.chromiumapp.org/');
  const SCOPE = encodeURIComponent([
    'user-read-email',
    'playlist-modify-private',
    'user-library-modify'
  ].join(' '));

  const baseUrl = 'https://accounts.spotify.com/authorize';
  const queryString =
    `client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}`;

  const spotifyAuthUrl = `${baseUrl}?${queryString}`;
  return spotifyAuthUrl;
}

function chromeMessageHandler(
  message: Message,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) {
  switch (message.type) {
    case LOGIN:
        chrome.identity.launchWebAuthFlow(
          { url: getSpotifyAuthUrl(), interactive: true },
          (redirectUrl) => onAuthRedirect(sendResponse, redirectUrl)
        );
      break;
    default:
      break;
  }
  return true;
}

function onAuthRedirect(
  sendResponse: (message?: Message) => void,
  redirectUrl?: string
) {
  if (!redirectUrl) {
    sendResponse({ type: AUTH_FAIL });
    return;
  }

  if (chrome.runtime.lastError || redirectUrl.includes('callback?error=access_denied')) {
    sendResponse({ type: AUTH_FAIL });
    return;
  }

  const parsedUrl = new URLParse(redirectUrl);
  const responseParameters = getResponseParametersFromHash(parsedUrl.hash);
  const accessToken = responseParameters.get('access_token');
  const state = responseParameters.get('state');

  if (state !== STATE || !accessToken) {
    sendResponse({ type: AUTH_FAIL });
    return;
  }

  sendResponse({ type: AUTH_SUCCESS, payload: accessToken });
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