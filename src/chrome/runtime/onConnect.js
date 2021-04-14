/**
 * @callback RuntimeConnectCallback
 * @param {chrome.runtime.Port} port
 */

/** @param {RuntimeConnectCallback} callback */
export default (callback) => chrome.runtime.onConnect.addListener(callback);
