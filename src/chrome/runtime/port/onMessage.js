/**
 * @callback RuntimePortMessageCallback
 * @param {Record<string, any>} message
 */

/**
 * @param {chrome.runtime.Port} port
 * @param {string} type
 * @param {RuntimePortMessageCallback} callback
 */
export default (port, type, callback) => {
  port.onMessage.addListener((message) => {
    if (message?.type !== type) return;

    delete message.type;
    callback(message);
  });
};
