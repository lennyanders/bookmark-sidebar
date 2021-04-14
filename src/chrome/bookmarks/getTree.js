/**
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode>}
 */
export default () => {
  return new Promise((resolve) => chrome.bookmarks.getTree(([bookmark]) => resolve(bookmark)));
};
