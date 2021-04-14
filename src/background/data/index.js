import { sendMessage } from '@chrome/runtime';
import { getTree } from '@chrome/bookmarks';
import { flattenArrayOfObjects } from '@utils';
import { getSidebarHtml } from './html';
import { getSettings } from '../settings';
import { getBookmarksHtml } from './html/getBookmarksHtml';
import './updateBookmarks';

export const root = document.createElement('template');
export const shadowRoot = root.content;

(async () => {
  const [bookmark, settings] = await Promise.all([getTree(), getSettings()]);

  const flattenedBookmarks = flattenArrayOfObjects([bookmark], 'children');
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
    sendMessage({ command: 'reload-tab' });
  }
})();
