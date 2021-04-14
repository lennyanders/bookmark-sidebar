/**
 * @param {chrome.bookmarks.BookmarkCreateArg} bookmark
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode>}
 */
export default (bookmark) => new Promise((resolve) => chrome.bookmarks.create(bookmark, resolve));
