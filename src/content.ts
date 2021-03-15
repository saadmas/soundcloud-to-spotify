import * as URLParse from "url-parse";
import { Message, Track } from "./types";

chrome.runtime.onMessage.addListener(chromeMessageHandler);

function chromeMessageHandler(
  message: Message,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) {
  switch (message.type) {
    case 'GET PLAYLIST':
      sendResponse({
        type: 'CONVERT PLAYLIST',
        name: getPlaylistName(),
        tracks: getPlaylistTracks()
      });
      break;
    default:
      break;
  }
  return true;
}

function getPlaylistName(): string {
  const playlistName = document.querySelector('.soundTitle__title')?.textContent?.trim();
  return playlistName ?? '';
}

function getPlaylistTracks(): Track[] {
  const tracks: Track[] = [];
  
  const trackListElement = document.querySelector('.trackList__list');
  const trackElements = trackListElement?.querySelectorAll('.trackList__item');

  if (!trackElements) {
    return tracks;
  }

  const trackElementsArray = Array.from(trackElements);
  for (const trackElement of trackElementsArray) {
    const artists = trackElement.querySelector('.trackItem__username')?.textContent?.trim() ?? getArtistNameFromUrl();
    const name = trackElement.querySelector('.trackItem__trackTitle')?.textContent?.trim();
    if (name) {
      tracks.push({ name, artists });
    }
  }

  return tracks;
}

function getArtistNameFromUrl(): string {
  const { pathname } = new URLParse(window.location.href);
  const pathParameters = pathname.split('/');
  const artistName = pathParameters[1] ?? '';
  return artistName;
}
