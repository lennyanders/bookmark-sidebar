import { browser } from 'webextension-polyfill-ts';
import { flattenArrayOfObjects } from '@utils';
import { getSidebarHtml } from './html';
import { getSettings } from '../settings';
import { getBookmarksHtml } from './html/getBookmarksHtml';
import './updateBookmarks';
import { root, shadowRoot } from './root';
export { root, shadowRoot };

(async () => {
  const [bookmarks, settings] = await Promise.all([browser.bookmarks.getTree(), getSettings()]);

  const flattenedBookmarks = flattenArrayOfObjects(bookmarks, 'children');
  const shownBookmark = flattenedBookmarks.find(
    (bookmark) => bookmark.id === settings.sidebarShwonBookmark,
  );

  root.innerHTML = getSidebarHtml({
    settings,
    allFolders: flattenedBookmarks.filter((bookmark) => !bookmark.url),
    bookmarksHtml: await getBookmarksHtml(shownBookmark || settings.sidebarShwonBookmark),
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(shadowRoot);
    browser.runtime.sendMessage({ command: 'reload-tab' });
  }
})();
