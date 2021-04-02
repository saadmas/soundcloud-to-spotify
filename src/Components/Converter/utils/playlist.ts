import { ApiResult, SpotifyApiType } from "../../../types";
import { tryGetRetryAfter } from "./networkRequest";

const batchLimit = 99;

export async function addTracksToPlaylist(
  trackIds: string[],
  playlistName: string,
  spotifyApi: SpotifyApiType
): Promise<ApiResult> {
  let hasError = false;

  try {
    const playlistId = await createSpotifyPlaylist(playlistName, spotifyApi);
    if (trackIds.length <= batchLimit) {
      await spotifyApi.addTracksToPlaylist(playlistId, trackIds);
    } else {
      await addBatchedTracksToPlaylist(playlistId, trackIds, spotifyApi);
    }
  } catch {
    hasError = true; /// re-run if 429 error
  }

  return { hasError };
}

async function createSpotifyPlaylist(name: string, spotifyApi: SpotifyApiType): Promise<string> {
  const { id: userId } = await spotifyApi.getMe();
  const { id: playlistId } = await spotifyApi.createPlaylist(userId, { name, public: false });
  return playlistId;
}

async function addBatchedTracksToPlaylist(
  playlistId: string,
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
      console.log(startIndex, endIndex)
      await spotifyApi.addTracksToPlaylist(playlistId, batchedTrackIds);
      startIndex += batchLimit;
      endIndex = (batchLimit + endIndex) <= finalIndex ? (batchLimit + endIndex) : finalIndex;
    } catch (e) {
      const retryAfter = tryGetRetryAfter(e);
      if (!Number.isNaN(retryAfter)) {
        await new Promise(r => setTimeout(r, retryAfter + 1));
      } else {
        hasError = true;
        break;
      }
    }
  }

  return { hasError };
}