/**
 * @callback BookmarkChangedCallback
 * @param {string} id
 * @param {chrome.bookmarks.BookmarkChangeInfo} changeInfo
 */

/** @param {BookmarkChangedCallback} callback */
export default (callback) => chrome.bookmarks.onChanged.addListener(callback);
