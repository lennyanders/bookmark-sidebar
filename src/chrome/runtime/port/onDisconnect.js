/**
 * @callback RuntimePortDisconnectCallback
 * @param {chrome.runtime.Port} port
 */

/**
 * @param {chrome.runtime.Port} port
 * @param {RuntimePortDisconnectCallback} callback
 */
export default (port, callback) => port.onDisconnect.addListener(callback);
