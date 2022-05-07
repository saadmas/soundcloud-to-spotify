import { Message, Track } from '../types';

chrome.runtime.onMessage.addListener(chromeMessageHandler);

function chromeMessageHandler(
  message: Message,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) {
  console.log(message); //*
  switch (message.type) {
    case 'GET PLAYLIST':
      (async () => {
        await scrollToEndOfPlaylist();
        sendResponse({
          type: 'CONVERT PLAYLIST',
          name: getSoundTitle(),
          tracks: getPlaylistTracks(),
        });
      })();
      break;
    case 'CHECK TRACK CONVERSION TYPE':
      console.log('CHECK TRACK CONVERSION TYPE');
      if (isCurrentlyOnSoundCloudTrackPage()) {
        console.log('TRACK PAGE CONFIRMED');
        sendResponse({ type: 'TRACK PAGE CONFIRMED' });
      }
      break;
    case 'GET TRACK':
      sendResponse({
        type: 'CONVERT TRACK',
        track: {
          name: getSoundTitle(),
          artist: getArtistNameFromSoundTitleHeader(),
          uploadedBy: '',
        },
      });
      break;
    default:
      break;
  }
  return true;
}

function isCurrentlyOnSoundCloudTrackPage(): boolean {
  if (!document.querySelector('.waveformWrapper')) {
    return false;
  }

  if (!document.querySelector('.soundTitle__title')) {
    return false;
  }

  return true;
}

function getSoundTitle(): string {
  const playlistName = document
    .querySelector('.soundTitle__title')
    ?.textContent?.trim();
  return playlistName ?? '';
}

function getPlaylistTracks(): Track[] {
  const tracks: Track[] = [];

  const trackListElement = document.querySelector('.trackList__list');
  const trackElements = trackListElement?.querySelectorAll('.trackList__item');

  if (!trackElements) {
    return tracks;
  }

  const uploadedBy = getArtistNameFromSoundTitleHeader();
  const trackElementsArray = Array.from(trackElements);

  for (const trackElement of trackElementsArray) {
    const artist =
      trackElement.querySelector('.trackItem__username')?.textContent?.trim() ??
      '';
    const name = trackElement
      .querySelector('.trackItem__trackTitle')
      ?.textContent?.trim();
    if (name) {
      tracks.push({ name, artist, uploadedBy });
    }
  }

  return tracks;
}

function getArtistNameFromSoundTitleHeader(): string {
  const artistNameFromPlaylistHeader = document
    .querySelector('.soundTitle__usernameHeroContainer')
    ?.textContent?.trim();
  return artistNameFromPlaylistHeader ?? '';
}

async function scrollToEndOfPlaylist() {
  while (!document.querySelector('.paging-eof')) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 500));
  }
  await new Promise((r) => setTimeout(r, 500));
}
