const playlistPathParameter = 'sets';

export function getConversionPrompt(soundCloudPath: string): string {
  let baseConversionPrompt = 'Convert';
  const pathParameters = soundCloudPath.split('/');

  if (pathParameters[2] === playlistPathParameter) {
    return `${baseConversionPrompt} playlist`;
  }

  return baseConversionPrompt;
}