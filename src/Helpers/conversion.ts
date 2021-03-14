import * as URLParse from "url-parse";
import { ConversionType } from "../types";

export function getConversionPromptText(conversionType: ConversionType): string {
  switch (conversionType) {
    case 'playlist':
      return 'Convert to Spotify playlist';
    default:
      return ''
  }
}

export function tryGetConversionTypeFromUrl(url: URLParse): ConversionType | undefined {
  const { hostname, pathname } = url;

  if (!hostname.includes('soundcloud.com')) {
    return;
  }

  const pathParameters = pathname.split('/');
  const primaryParameter = pathParameters[2];

  switch (primaryParameter) {
    case 'sets':
      return 'playlist';
    case 'likes':
      return 'likes';
    default:
      return;
  }
}