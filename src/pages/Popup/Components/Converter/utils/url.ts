import URLParse from 'url-parse';
import { ConversionType } from '../../../../types';

export function tryGetConversionTypeFromUrl(
  url: URLParse<string>
): ConversionType | undefined {
  const { hostname, pathname } = url;

  if (!hostname.includes('soundcloud.com')) {
    return;
  }

  const pathParameters = pathname.split('/');
  const primaryParameter = pathParameters[2];

  if (pathParameters.length > 3 && primaryParameter === 'sets') {
    return 'playlist';
  }

  if (primaryParameter === 'likes') {
    return 'likes';
  }

  return;
}
