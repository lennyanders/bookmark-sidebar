/**
 * @callback RuntimeMessageCallback
 * @param {Object} message
 * @param {chrome.runtime.MessageSender} sender
 */

/** @param {RuntimeMessageCallback} callback */
export default (callback) => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse(callback(message, sender));
  });
};
