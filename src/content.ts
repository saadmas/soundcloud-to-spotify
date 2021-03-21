import { Message, Track } from "./types";

chrome.runtime.onMessage.addListener(chromeMessageHandler);

function chromeMessageHandler(
  message: Message,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) {
  console.log('message handler in content.ts')
  console.log(message)
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

  scrollToEndOfPlaylist();

  const uploadedBy = getArtistNameFromPlaylistHeader();
  const trackElementsArray = Array.from(trackElements);

  for (const trackElement of trackElementsArray) {
    const artist = trackElement.querySelector('.trackItem__username')?.textContent?.trim() ?? '';
    const name = trackElement.querySelector('.trackItem__trackTitle')?.textContent?.trim();
    if (name) {
      tracks.push({ name, artist, uploadedBy });
    }
  }

  console.log('tracks')
  console.log(tracks)//*
  return tracks;
}

function getArtistNameFromPlaylistHeader(): string {
  const artistNameFromPlaylistHeader = document.querySelector('.soundTitle__usernameHeroContainer')?.textContent?.trim();
  return artistNameFromPlaylistHeader ?? '';
}

function scrollToEndOfPlaylist() {
  while (!document.querySelector('.paging-eof')) {
    window.scrollTo(0, document.body.scrollHeight);
  }
}
