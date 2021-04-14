import { getSubTree, onRemoved, onCreated, onMoved, onChanged } from '@chrome/bookmarks';
import { flattenArrayOfObjects, getBaseUrl } from '@utils';
import { $ } from '@utils/dom';
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

/** @param {chrome.bookmarks.BookmarkTreeNode} bookmark */
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

onRemoved((bookmarkId, removeInfo) => {
  if (!removeInfo.node.url) {
    folderRemoved({ folderId: bookmarkId });
    postMessageToAll('folderRemoved', { folderId: bookmarkId });
  }
  bgRemoveBookmark(bookmarkId);
});

onCreated(async (bookmark) => {
  if (!bookmark.url) {
    const newFolderHtml = html`<option value="${bookmark.id}">${bookmark.title}</option>`;
    newFolder({ newFolderHtml });
    postMessageToAll('newFolder', { newFolderHtml });
  }
  await bgCreateBookmark(bookmark);
});

onMoved(async (id, { parentId, oldParentId, index, oldIndex }) => {
  const parentFolderUl = getFolderUl(parentId);
  if (!parentFolderUl) return bgRemoveBookmark(id);

  const oldParentFolder = getFolderUl(oldParentId);
  if (!oldParentFolder) return bgCreateBookmark(await getSubTree(id));

  moveBookmark({ id, parentId, oldParentId, index, oldIndex });
  postMessageToAll('moveBookmark', { id, parentId, oldParentId, index, oldIndex });
});

onChanged((id, { title, url }) => {
  const bookmark = getBookmark(id);
  if (!bookmark) return;

  changeBookmark({ id, title, url });
  postMessageToAll('changeBookmark', { id, title, url });
});
