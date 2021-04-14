/**
 * @param {chrome.runtime.Port} port
 * @param {string} type
 * @param {Record<string, any>} [message]
 */
export default (port, type, message) => port.postMessage({ ...message, type });
