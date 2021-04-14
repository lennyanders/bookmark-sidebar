/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export default (id) => new Promise((resolve) => chrome.bookmarks.removeTree(id, resolve));
