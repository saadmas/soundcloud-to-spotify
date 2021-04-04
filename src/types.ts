import SpotifyWebApi from "spotify-web-api-js";

export type ConversionType = 'playlist' | 'likes' | 'track';
export type SpotifyApiType = SpotifyWebApi.SpotifyWebApiJs;

export interface Track {
  name: string;
  artist: string;
  uploadedBy: string;
}

export interface ApiResult {
  hasError?: boolean;
}

interface GetPlaylistMessage {
  type: 'GET PLAYLIST';
}

interface GetTrackMessage {
  type: 'GET TRACK';
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

interface CheckTrackConversionTypeMessage {
  type: 'CHECK TRACK CONVERSION TYPE';
}

interface TrackPageConfirmedMessage {
  type: 'TRACK PAGE CONFIRMED';
}

interface ConvertTrackMessage {
  type: 'CONVERT TRACK';
  track: Track;
}

interface ConvertPlaylistMessage {
  type: 'CONVERT PLAYLIST';
  name: string;
  tracks: Track[];
}

export type Message = AuthFailMessage | AuthSuccessMessage | LoginMessage | GetPlaylistMessage | ConvertPlaylistMessage |
  CheckTrackConversionTypeMessage | TrackPageConfirmedMessage | ConvertTrackMessage | GetTrackMessage;
 
