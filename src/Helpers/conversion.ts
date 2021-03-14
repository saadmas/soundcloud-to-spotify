const playlistPathParameter = 'sets';

export function getConversionPrompt(soundCloudPath: string): string {
  const pathParameters = soundCloudPath.split('/');

  if (pathParameters[2] === playlistPathParameter) {
    return `Convert to Spotify playlist`;
  }

  return '';
}