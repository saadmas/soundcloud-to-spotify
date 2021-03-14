export const LOGIN = 'LOGIN';
export const AUTH_FAIL = 'AUTH FAIL';
export const AUTH_SUCCESS = 'AUTH SUCCESS';

interface AuthFailMessage {
  type: 'AUTH FAIL';
}

interface AuthSuccessMessage {
  type: 'AUTH SUCCESS';
  token: string;
}

interface LoginMessage {
  type: 'LOGIN';
}

export type Message = AuthFailMessage | AuthSuccessMessage | LoginMessage;
 
