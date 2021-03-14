import { CONVERT_PLAYLIST, GET_PLAYLIST, Message, Track } from "./types";

const playListNameSelector = '.soundTitle__title';
const trackListSelector = '.trackList__list';
const trackItemSelector = '.trackList__item';
const trackArtistSelector = '.trackItem__username';
const trackNameSelector = '.trackItem__trackTitle';

chrome.runtime.onMessage.addListener(chromeMessageHandler);

function chromeMessageHandler(
  message: Message,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) {
  switch (message.type) {
    case GET_PLAYLIST:
      sendResponse({
        type: CONVERT_PLAYLIST,
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
  const playlistName = document.querySelector(playListNameSelector)?.textContent?.trim();
  return playlistName ?? '';
}

function getPlaylistTracks(): Track[] {
  const tracks: Track[] = [];
  
  const trackListElement = document.querySelector(trackListSelector);
  const trackElements = trackListElement?.querySelectorAll(trackItemSelector);

  if (!trackElements) {
    return tracks;
  }

  const trackElementsArray = Array.from(trackElements);
  for (const trackElement of trackElementsArray) {
    const artists = trackElement.querySelector(trackArtistSelector)?.textContent?.trim() ?? '';
    const name = trackElement.querySelector(trackNameSelector)?.textContent?.trim();
    if (name) {
      tracks.push({ name, artists });
    }
  }

  return tracks;
}
