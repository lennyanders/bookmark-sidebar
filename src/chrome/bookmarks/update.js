/**
 * @param {string} id
 * @param {chrome.bookmarks.BookmarkChangesArg} changes
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode>}
 */
export default (id, changes) => {
  return new Promise((resolve) => chrome.bookmarks.update(id, changes, resolve));
};
