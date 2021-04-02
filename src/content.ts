import { Message, Track } from "./types";

chrome.runtime.onMessage.addListener(chromeMessageHandler);

function chromeMessageHandler(
  message: Message,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) {
  switch (message.type) {
    case 'GET PLAYLIST':
      (async () => {
        await scrollToEndOfPlaylist();
        sendResponse({
          type: 'CONVERT PLAYLIST',
          name: getPlaylistName(),
          tracks: getPlaylistTracks()
        });
      })();
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

  const uploadedBy = getArtistNameFromPlaylistHeader();
  const trackElementsArray = Array.from(trackElements);

  for (const trackElement of trackElementsArray) {
    const artist = trackElement.querySelector('.trackItem__username')?.textContent?.trim() ?? '';
    const name = trackElement.querySelector('.trackItem__trackTitle')?.textContent?.trim();
    if (name) {
      tracks.push({ name, artist, uploadedBy });
    }
  }

  return tracks;
}

function getArtistNameFromPlaylistHeader(): string {
  const artistNameFromPlaylistHeader = document.querySelector('.soundTitle__usernameHeroContainer')?.textContent?.trim();
  return artistNameFromPlaylistHeader ?? '';
}

async function scrollToEndOfPlaylist() {
  while (!document.querySelector('.paging-eof')) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 500));
  }
  await new Promise(r => setTimeout(r, 500));
}
