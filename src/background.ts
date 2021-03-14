import { LOGIN, Message } from "./types";
import { getSpotifyAuthUrl, onAuthRedirect } from "./Helpers/auth";

chrome.runtime.onMessage.addListener(chromeMessageHandler);

function chromeMessageHandler(
  message: Message,
  _: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) {
  switch (message.type) {
    case LOGIN:
      const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
      chrome.identity.launchWebAuthFlow(
        { url: getSpotifyAuthUrl(STATE), interactive: true },
        (redirectUrl) => onAuthRedirect(sendResponse, STATE, redirectUrl)
      );
      break;
    default:
      break;
  }
  return true;
}