/**
 * @param {string | string[] | Object} [keys]
 * @returns {Promise<Record<string, any>>}
 */
export default (keys) => {
  return new Promise((resolve) => chrome.storage.sync.get(keys, resolve));
};
