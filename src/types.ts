export type ConversionType = 'playlist' | 'likes';

export interface Track {
  name: string;
  artist: string;
  uploadedBy: string;
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
 
