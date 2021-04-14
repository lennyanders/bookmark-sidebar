/**
 * @param {number} id
 * @param {chrome.tabs.ReloadProperties} [reloadProperties]
 * @returns {Promise<void>}
 */
export default (id, reloadProperties) => {
  return new Promise((resolve) => chrome.tabs.reload(id, reloadProperties || {}, resolve));
};
