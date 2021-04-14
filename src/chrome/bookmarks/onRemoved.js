/**
 * @callback BookmarkRemovedCallback
 * @param {string} id
 * @param {chrome.bookmarks.BookmarkRemoveInfo} removeInfo
 */

/** @param {BookmarkRemovedCallback} callback */
export default (callback) => chrome.bookmarks.onRemoved.addListener(callback);
