/**
 * @param {string} id
 * @param {chrome.bookmarks.BookmarkDestinationArg} destination
 * @returns {chrome.bookmarks.BookmarkTreeNode}
 */
export default (id, destination) => {
  return new Promise((resolve) => chrome.bookmarks.move(id, destination, resolve));
};
