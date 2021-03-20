import { ApiResult, SpotifyApiType } from "../../../types";

interface SpotifyPlaylistResult extends ApiResult {
  doesPlaylistExist: boolean;
}

async function doesSpotifyPlaylistExist(playlistName: string, spotifyApi: SpotifyApiType): Promise<SpotifyPlaylistResult> {
  let hasError = false;
  let doesPlaylistExist = true;
  let offset = 0;
  let hasNextPage = false;

  try {
    do {
      const playlistsResult = await getSpotifyPlaylists(spotifyApi, offset);
      const { items, next } = playlistsResult;
      hasNextPage = !!next;
      doesPlaylistExist = items.some(item => item.name === playlistName);
      offset += 50;
    } while (hasNextPage && !doesPlaylistExist);
  }
  catch {
    hasError = true;
  }

  return { hasError, doesPlaylistExist };
}

export async function addTracksToPlaylist(trackIds: string[], playlistName: string) {

}

async function createPlaylist(playlistName: string) {
  
}


async function getSpotifyPlaylists(spotifyApi: SpotifyApiType, offset: number) {
  const limit = 50;
  const playlists = await spotifyApi.getUserPlaylists(undefined, { limit, offset });
  return playlists;
}
