/**
 * @param {string} id
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode>}
 */
export default (id) => {
  return new Promise((resolve) => {
    chrome.bookmarks.getSubTree(id, ([bookmark]) => resolve(bookmark));
  });
};
