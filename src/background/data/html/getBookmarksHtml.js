import { getMessage } from '@chrome/i18n';
import { getSubTree } from '@chrome/bookmarks';
import { flattenArrayOfObjects, getBaseUrl } from '@utils';
import { loadFavicons, faviconDataUrls } from '../../favicon';
import { getBookmarkHtml } from './getBookmarkHtml';
import { html } from './html';

/** @param {string | chrome.bookmarks.BookmarkTreeNode} bookmarkIdOrBookmark */
export const getBookmarksHtml = async (bookmarkIdOrBookmark) => {
  const bookmark =
    typeof bookmarkIdOrBookmark === 'string'
      ? await getSubTree(bookmarkIdOrBookmark)
      : bookmarkIdOrBookmark;

  if (!bookmark?.children?.length) return html`<span>${getMessage('noBookmarkFound')}</span>`;

  await loadFavicons(
    flattenArrayOfObjects(bookmark.children, 'children')
      .filter((bm) => bm.url)
      .map((bm) => getBaseUrl(bm.url))
      .filter((url) => !faviconDataUrls.has(url)),
  );

  return html`<ul>
    ${bookmark.children.map(getBookmarkHtml)}
  </ul>`;
};
