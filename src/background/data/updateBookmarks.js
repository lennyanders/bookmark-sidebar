import { getSubTree, onRemoved, onCreated, onMoved, onChanged } from '@chrome/bookmarks';
import { flattenArrayOfObjects, getBaseUrl } from '@utils';
import { loadFavicons, faviconDataUrls } from '../favicon';
import { postMessageToAll } from '../middleware';
import { getBookmarkHtml, html } from './html';
import { shadowRoot } from './index';

/** @param {HTMLElement} bookmark */
const updateFolderIcon = (bookmark) => {
  bookmark
    ?.querySelector('.bookmark__icon use')
    ?.setAttribute(
      'href',
      `#folder${
        bookmark.querySelector('.bookmark__children').children.length ? '' : '-empty'
      }-icon`,
    );
};

/** @param {string} id */
const getBookmark = (id) => shadowRoot.getElementById(`b${id}`);
/** @param {string} id */
const getFolderUl = (id) => shadowRoot.querySelector(`#b${id} ul`);

/** @param {string} id */
const removeBookmark = (id) => {
  const bookmark = getBookmark(id);
  if (!bookmark) return;

  const parentBookmark = bookmark.parentNode.closest('.bookmark');
  bookmark.remove();

  updateFolderIcon(parentBookmark);

  postMessageToAll('removeBookmark', { id });
};

/** @param {chrome.bookmarks.BookmarkTreeNode} bookmark */
const createBookmark = async (bookmark) => {
  const parentFolderUl = getFolderUl(bookmark.parentId);
  if (!parentFolderUl) return;

  await loadFavicons(
    flattenArrayOfObjects([bookmark], 'children')
      .filter((bm) => bm.url)
      .map((bm) => getBaseUrl(bm.url))
      .filter((url) => !faviconDataUrls.has(url)),
  );

  const bookmarkHtml = getBookmarkHtml(bookmark);

  if (!bookmark.index) parentFolderUl.insertAdjacentHTML('afterbegin', bookmarkHtml);
  else parentFolderUl.children[bookmark.index - 1].insertAdjacentHTML('afterend', bookmarkHtml);

  updateFolderIcon(parentFolderUl.closest('.bookmark'));

  postMessageToAll('createBookmark', {
    parentId: bookmark.parentId,
    index: bookmark.index,
    bookmarkHtml,
  });
};

onRemoved((bookmarkId, removeInfo) => {
  if (!removeInfo.node.url) {
    shadowRoot
      .querySelector(`.js-modal-settings [name="sidebarShwonBookmark"] > [value="${bookmarkId}"]`)
      .remove();

    postMessageToAll('folderRemoved', { folderId: bookmarkId });
  }

  removeBookmark(bookmarkId);
});

onCreated(async (bookmark) => {
  if (!bookmark.url) {
    const newFolderHtml = html`<option value="${bookmark.id}">${bookmark.title}</option>`;
    shadowRoot
      .querySelector('.js-modal-settings [name="sidebarShwonBookmark"]')
      .insertAdjacentHTML('beforeend', newFolderHtml);

    postMessageToAll('newFolder', { newFolderHtml });
  }

  await createBookmark(bookmark);
});

onMoved(async (id, { parentId, oldParentId, index, oldIndex }) => {
  const parentFolderUl = getFolderUl(parentId);
  if (!parentFolderUl) return removeBookmark(id);

  const oldParentFolder = getFolderUl(oldParentId);
  if (!oldParentFolder) return createBookmark(await getSubTree(id));

  const bookmark = getBookmark(id);
  if (parentId === oldParentId) {
    parentFolderUl.children[index][index > oldIndex ? 'after' : 'before'](bookmark);
  } else {
    if (!index) parentFolderUl.prepend(bookmark);
    else parentFolderUl.children[index - 1].after(bookmark);
  }
  updateFolderIcon(getBookmark(oldParentId));
  updateFolderIcon(getBookmark(parentId));

  postMessageToAll('moveBookmark', { id, parentId, oldParentId, index, oldIndex });
});

onChanged((id, { title, url }) => {
  const bookmarkLink = shadowRoot.querySelector(`#b${id} .bookmark__link`);
  if (!bookmarkLink) return;

  if (url) {
    bookmarkLink.href = url;
    bookmarkLink.title = `${title} | ${url}`;
  } else {
    bookmarkLink.title = title;
  }

  const bookmarkTitle = bookmarkLink.querySelector('.bookmark__title');
  bookmarkTitle.textContent = title;

  postMessageToAll('changeBookmark', { id, title, url });
});
