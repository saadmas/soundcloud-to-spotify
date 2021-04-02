export function tryGetRetryAfter(error: any): number {
  return 'getResponseHeader' in error ? +error?.getResponseHeader('retry-after') : NaN;
}