/**
 * @param {Record<string, any} items
 * @returns {Promise<void>}
 */
export default (items) => new Promise((resolve) => chrome.storage.sync.set(items, resolve));
