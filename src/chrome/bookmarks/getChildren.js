/**
 * @param {string} id
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode[]>}
 */
export default (id) => new Promise((resolve) => chrome.bookmarks.getChildren(id, resolve));
