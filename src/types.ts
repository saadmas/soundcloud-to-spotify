export interface Message {
  type: string;
  payload?: string;
}

export const LOGIN = 'LOGIN';
export const AUTH_FAIL = 'AUTH FAIL';
export const AUTH_SUCCESS = 'AUTH SUCCESS';

