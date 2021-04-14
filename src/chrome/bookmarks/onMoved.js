/**
 * @callback BookmarkMovedCallback
 * @param {string} id
 * @param {chrome.bookmarks.BookmarkMoveInfo} moveInfo
 */

/** @param {BookmarkMovedCallback} callback */
export default (callback) => chrome.bookmarks.onMoved.addListener(callback);
