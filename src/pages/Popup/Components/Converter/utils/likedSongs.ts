import { ApiResult, SpotifyApiType } from '../../../../types';
import { tryGetRetryAfter } from './networkRequest';

const batchLimit = 99;

export async function addTracksToLikedSongs(
  trackIdsWithTrackPrefix: string[],
  spotifyApi: SpotifyApiType
): Promise<ApiResult> {
  let hasError = false;
  const trackIds = trackIdsWithTrackPrefix.map((t) => t.split(':')[2]);

  try {
    if (trackIds.length <= batchLimit) {
      await spotifyApi.addToMySavedTracks(trackIds);
    } else {
      await addBatchedTracksToLikedSongs(trackIds, spotifyApi);
    }
  } catch {
    hasError = true;
  }

  return { hasError };
}

async function addBatchedTracksToLikedSongs(
  trackIds: string[],
  spotifyApi: SpotifyApiType
) {
  const finalIndex = trackIds.length - 1;
  let startIndex = 0;
  let endIndex = batchLimit;
  let hasError = false;

  while (startIndex <= finalIndex) {
    try {
      const batchedTrackIds = trackIds.slice(startIndex, endIndex + 1);
      console.log(startIndex, endIndex);
      await spotifyApi.addToMySavedTracks(batchedTrackIds);
      startIndex += batchLimit;
      endIndex =
        batchLimit + endIndex <= finalIndex
          ? batchLimit + endIndex
          : finalIndex;
    } catch (e) {
      const retryAfter = tryGetRetryAfter(e);
      if (!Number.isNaN(retryAfter)) {
        await new Promise((r) => setTimeout(r, retryAfter + 1));
      } else {
        hasError = true;
        break;
      }
    }
  }

  return { hasError };
}
