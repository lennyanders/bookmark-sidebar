/**
 * @callback BrowserActionClickedCallback
 * @param {chrome.tabs.Tab} tab
 */

/** @param {BrowserActionClickedCallback} callback */
export default (callback) => chrome.browserAction.onClicked.addListener(callback);
