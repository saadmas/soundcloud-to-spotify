import * as React from 'react'
const { useState, useEffect } = React;
import { Message } from '../types';

const useChromeMessageListener = () => {
  const [m] = useState({});

  useEffect(() => {
    chrome.runtime.onMessage.addListener(chromeMessageHandler);

    function chromeMessageHandler(
      message: Message,
      _: chrome.runtime.MessageSender,
      sendResponse: (response?: Message) => void
    ) {
      console.log('message handler in hook')
      console.log(message)
      switch (message.type) {
        default:
          break;
      }
      return true;
    }
    
    return () => chrome.runtime.onMessage.removeListener(chromeMessageHandler)
  }, []);

  return m;
};

export default useChromeMessageListener;