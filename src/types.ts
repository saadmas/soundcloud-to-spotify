export const LOGIN = 'LOGIN';
export const AUTH_FAIL = 'AUTH FAIL';
export const AUTH_SUCCESS = 'AUTH SUCCESS';
export const CONVERT_PLAYLIST = 'CONVERT PLAYLIST';
export const GET_PLAYLIST = 'GET PLAYLIST';

export interface Track {
  name: string;
  artists: string;
}

interface GetPlaylistMessage {
  type: 'GET PLAYLIST';
}

interface AuthFailMessage {
  type: 'AUTH FAIL';
}

interface AuthSuccessMessage {
  type: 'AUTH SUCCESS';
  token: string;
}

interface LoginMessage {
  type: 'LOGIN';
}

interface ConvertPlaylistMessage {
  type: 'CONVERT PLAYLIST';
  name: string;
  tracks: Track[];
}

export type Message = AuthFailMessage | AuthSuccessMessage | LoginMessage | GetPlaylistMessage | ConvertPlaylistMessage;
 
