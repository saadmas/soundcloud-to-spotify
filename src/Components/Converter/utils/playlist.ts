import { ApiResult, SpotifyApiType } from "../../../types";

export async function addTracksToPlaylist(
  trackIds: string[],
  playlistName: string,
  spotifyApi: SpotifyApiType
): Promise<ApiResult> {
  let hasError = false;

  try {
    const playlistId = await createSpotifyPlaylist(playlistName, spotifyApi);
    await spotifyApi.addTracksToPlaylist(playlistId, trackIds);
  } catch {
    hasError = true;
  }

  return { hasError };
}

async function createSpotifyPlaylist(name: string, spotifyApi: SpotifyApiType): Promise<string> {
  const { id: userId } = await spotifyApi.getMe();
  const { id: playlistId } = await spotifyApi.createPlaylist(userId, { name, public: false });
  return playlistId;
}