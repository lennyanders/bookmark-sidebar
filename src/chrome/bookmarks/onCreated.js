/**
 * @callback BookmarkCreatedCallback
 * @param {chrome.bookmarks.BookmarkTreeNode} bookmark
 */

/** @param {BookmarkCreatedCallback} callback */
export default (callback) => {
  chrome.bookmarks.onCreated.addListener((_id, bookmark) => callback(bookmark));
};
