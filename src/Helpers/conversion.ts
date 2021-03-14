import { ConversionType } from "../types";

export function getConversionPromptText(conversionType: ConversionType): string {
  switch (conversionType) {
    case 'playlist':
      return 'Convert to Spotify playlist';
    default:
      return ''
  }
}

export function getConversionTypeFromSoundCloudPath(soundCloudPath: string): ConversionType {
  const pathParameters = soundCloudPath.split('/');

  if (pathParameters[2] === 'sets') {
    return 'playlist';
  }

  return 'playlist';
}