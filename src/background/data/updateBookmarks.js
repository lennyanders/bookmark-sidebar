import { browser, Bookmarks } from 'webextension-polyfill-ts';
import { flattenArrayOfObjects, getBaseUrl } from '@utils';
import {
  getBookmark,
  getFolderUl,
  removeBookmark,
  createBookmark,
  moveBookmark,
  changeBookmark,
} from '@shared/bookmark';
import { newFolder, folderRemoved } from '@shared/settings';
import { loadFavicons, faviconDataUrls } from '../favicon';
import { postMessageToAll } from '../middleware';
import { getBookmarkHtml, html } from './html';

/** @param {string} id */
const bgRemoveBookmark = (id) => {
  const bookmark = getBookmark(id);
  if (bookmark) {
    removeBookmark({ id });
    postMessageToAll('removeBookmark', { id });
  }
};

/** @param {Bookmarks.BookmarkTreeNode} bookmark */
const bgCreateBookmark = async (bookmark) => {
  const parentFolderUl = getFolderUl(bookmark.parentId);
  if (!parentFolderUl) return;

  await loadFavicons(
    flattenArrayOfObjects([bookmark], 'children')
      .filter((bm) => bm.url)
      .map((bm) => getBaseUrl(bm.url))
      .filter((url) => !faviconDataUrls.has(url)),
  );
  const bookmarkHtml = getBookmarkHtml(bookmark);

  createBookmark({
    parentId: bookmark.parentId,
    index: bookmark.index,
    bookmarkHtml,
  });
  postMessageToAll('createBookmark', {
    parentId: bookmark.parentId,
    index: bookmark.index,
    bookmarkHtml,
  });
};

browser.bookmarks.onRemoved.addListener((bookmarkId, removeInfo) => {
  if (!removeInfo.node.url) {
    folderRemoved({ folderId: bookmarkId });
    postMessageToAll('folderRemoved', { folderId: bookmarkId });
  }
  bgRemoveBookmark(bookmarkId);
});

browser.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (!bookmark.url) {
    const newFolderHtml = html`<option value="${id}">${bookmark.title}</option>`;
    newFolder({ newFolderHtml });
    postMessageToAll('newFolder', { newFolderHtml });
  }
  await bgCreateBookmark(bookmark);
});

browser.bookmarks.onMoved.addListener(async (id, { parentId, oldParentId, index, oldIndex }) => {
  const parentFolderUl = getFolderUl(parentId);
  if (!parentFolderUl) return bgRemoveBookmark(id);

  const oldParentFolder = getFolderUl(oldParentId);
  if (!oldParentFolder) return bgCreateBookmark(await browser.bookmarks.getSubTree(id));

  moveBookmark({ id, parentId, oldParentId, index, oldIndex });
  postMessageToAll('moveBookmark', { id, parentId, oldParentId, index, oldIndex });
});

browser.bookmarks.onChanged.addListener((id, { title, url }) => {
  const bookmark = getBookmark(id);
  if (!bookmark) return;

  changeBookmark({ id, title, url });
  postMessageToAll('changeBookmark', { id, title, url });
});
