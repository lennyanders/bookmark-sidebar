import { browser, Bookmarks } from 'webextension-polyfill-ts';
import { dictionaryKeys } from '@dictionary';
import { flattenArrayOfObjects, getBaseUrl } from '@utils';
import { loadFavicons, faviconDataUrls } from '../../favicon';
import { getBookmarkHtml } from './getBookmarkHtml';
import { html } from './html';

/** @param {string | Bookmarks.BookmarkTreeNode} bookmarkIdOrBookmark */
export const getBookmarksHtml = async (bookmarkIdOrBookmark) => {
  const bookmark =
    typeof bookmarkIdOrBookmark === 'string'
      ? (await browser.bookmarks.getSubTree(bookmarkIdOrBookmark))[0]
      : bookmarkIdOrBookmark;

  if (!bookmark?.children?.length) {
    return html`<span>${browser.i18n.getMessage(dictionaryKeys.noBookmarkFound)}</span>`;
  }

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
