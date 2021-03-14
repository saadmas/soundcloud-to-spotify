import * as URLParse from "url-parse";
import { AUTH_FAIL, AUTH_SUCCESS, Message } from "../types";

export function getSpotifyAuthUrl(state: string): string {
  const clientId = 'f5a2c30e102140d0970820bcd154dba8';
  const responseType = encodeURIComponent('token');
  const redirecUri = encodeURIComponent('https://opdbejkeklgoefcmfeaehnnhpnnnnpii.chromiumapp.org/');
  const scope = encodeURIComponent([
    'user-read-email',
    'playlist-modify-private',
    'user-library-modify'
  ].join(' '));

  const baseUrl = 'https://accounts.spotify.com/authorize';
  const queryString =
    `client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirecUri}&state=${state}&scope=${scope}`;

  const spotifyAuthUrl = `${baseUrl}?${queryString}`;
  return spotifyAuthUrl;
}

export function onAuthRedirect(
  sendResponse: (message?: Message) => void,
  state: string,
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
  const responseState = responseParameters.get('state');

  if (state !== responseState || !accessToken) {
    sendResponse({ type: AUTH_FAIL });
    return;
  }

  sendResponse({ type: AUTH_SUCCESS, payload: accessToken });
}

export function getResponseParametersFromHash(hash: string): Map<string, string> {
  const responseParamters = new Map<string, string>();
  const hashWithoutPoundPrefix = hash.substring(1); 
  const responsePairs = hashWithoutPoundPrefix.split('&');

  for (const responsePair of responsePairs) {
    const [key, value] = responsePair.split('=');
    responseParamters.set(key, value);
  }

  return responseParamters;
}

