import { ApiResult, SpotifyApiType, Track } from "../../../types";

type SpotifySearchType = 'TRACK - ARTIST' | 'TRACK - UPLOADED BY' | 'TRACK';

interface SpotifyTrackSearchResult extends ApiResult {
  spotifyTrackIds: string[];
  missingTracks: Track[];
}

export const LOGIN_FAIL_ERROR = 'An error occurred while connecting to your Spotify account. Please try again.'
export const CONVERT_PLAYLIST_ERROR = 'An error while creating your Spotify playlist. Please try again.'

export async function getSpotifyTrackIds(
  tracks: Track[],
  spotifyApi: SpotifyApiType
): Promise<SpotifyTrackSearchResult> {
  const spotifyTrackIds: string[] = [];
  const missingTracks: Track[] = [];
  let hasError = false;
  let index = -1;

  while (index < tracks.length) {
    try {
      index++;
      const track = tracks[index];
      const trackId = await getSpotifyTrackId(track, spotifyApi);

      if (trackId === undefined) {
        missingTracks.push(track);
        continue;
      }

      spotifyTrackIds.push(trackId);
    } catch (e) {
      const retryAfter = 'getResponseHeader' in e ? +e?.getResponseHeader('retry-after') : NaN;
      if (!Number.isNaN(retryAfter)) {
        index--;
        await new Promise(r => setTimeout(r, retryAfter + 1));
      } else {
        console.log(e);
        hasError = true;
      }
    }
  }

  return { spotifyTrackIds, missingTracks, hasError };
}

async function getSpotifyTrackId(track: Track, spotifyApi: SpotifyApiType): Promise<string | undefined> {
  const searchOptions = { market: 'from_token', limit: 1 };

  const searchTypes: SpotifySearchType[] = ['TRACK - UPLOADED BY', 'TRACK'];
  if (track.artist) {
    searchTypes.unshift('TRACK - ARTIST');
  }

  for (const searchType of searchTypes) {
    const searchQuery = getSpotifySearchQuery(track, searchType);
    const searchResult = await spotifyApi.searchTracks(searchQuery, searchOptions);
    if (searchResult.tracks.items.length) {
      console.log(searchResult.tracks.items[0]); //*
      return searchResult.tracks.items[0].uri;
    }
  }

  let cleanedTrack = getCleanedTrack(track);
  for (const searchType of searchTypes) {
    const searchQuery = getSpotifySearchQuery(cleanedTrack, searchType);
    const searchResult = await spotifyApi.searchTracks(searchQuery, searchOptions);
    if (searchResult.tracks.items.length) {
      console.log(searchResult.tracks.items[0]); //*
      return searchResult.tracks.items[0].uri;
    }
  }

  cleanedTrack = getCleanedTrack(track, true, true);
  for (const searchType of searchTypes) {
    const searchQuery = getSpotifySearchQuery(cleanedTrack, searchType);
    const searchResult = await spotifyApi.searchTracks(searchQuery, searchOptions);
    if (searchResult.tracks.items.length) {
      console.log(searchResult.tracks.items[0]); //*
      return searchResult.tracks.items[0].uri;
    }
  }
  

  return;
}

function getRegexTrackNameFilter(removeBrackets?: boolean, removeColonAppendedText?: boolean) {
  const leadMatcher = '[\\.]*';
  const prefixMatcher = '\\W';

  // Remove ft. feat. featuring.
  const featureFilters = [
    `${prefixMatcher}featuring${leadMatcher}`,
    `${prefixMatcher}feat${leadMatcher}`,
    `${prefixMatcher}ft${leadMatcher}`,
  ];

  // Remove - &
  const separatorfilters = ['-', '&'];
  
  let filter = [...featureFilters, ...separatorfilters].join('|');

  if (removeBrackets) {
    // Remove anything WITHIN square brackets
    const squareBracketFilter = '\\[.+\\]';
    // Remove round brackets, but not anything within them
    const roundBracketFilter = '\\(|\\)';
    filter = `${filter}|${squareBracketFilter}|${roundBracketFilter}`;
  }

  if (removeColonAppendedText) {
    const colonAppendedTextFilter = '\.*:';
    filter = `${filter}|${colonAppendedTextFilter}`;
  }

  return new RegExp(filter, 'ig');
}

function getCleanedTrack(track: Track, removeBrackets?: boolean, removeColonAppendedText?: boolean): Track {
  const filter = getRegexTrackNameFilter(removeBrackets, removeColonAppendedText);
  return {
    ...track,
    name: track.name.replace(filter, '')
  };
}

function getSpotifySearchQuery(track: Track, searchType: SpotifySearchType): string {
  const { name, artist, uploadedBy } = track;
  switch (searchType) {
    case 'TRACK':
      return name;
    case 'TRACK - UPLOADED BY':
      return `${name} artist:${uploadedBy}`;
    case 'TRACK - ARTIST':
    default:
      return `${name} artist:${artist}`;
  }
}