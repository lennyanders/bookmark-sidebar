import { $, closest } from '@utils/dom';

/** @param {string} id */
export const getBookmark = (id) => $(`#b${id}`);

/** @param {string} id */
export const getFolderUl = (id) => $(`#b${id} ul`);

/** @param {HTMLElement} bookmark */
export const updateFolderIcon = (bookmark) => {
  if (!bookmark) return;
  $('.bookmark__icon use', bookmark)?.setAttribute(
    'href',
    `#folder${$('.bookmark__children', bookmark).children.length ? '' : '-empty'}-icon`,
  );
};

export const removeBookmark = ({ id }) => {
  const bookmark = getBookmark(id);
  const parentBookmark = closest(bookmark, '.bookmark');
  bookmark.remove();
  updateFolderIcon(parentBookmark);
};

export const createBookmark = ({ parentId, index, bookmarkHtml }) => {
  const parentFolderUl = getFolderUl(parentId);

  if (!index) parentFolderUl.insertAdjacentHTML('afterbegin', bookmarkHtml);
  else parentFolderUl.children[index - 1].insertAdjacentHTML('afterend', bookmarkHtml);

  updateFolderIcon(closest(parentFolderUl, '.bookmark'));

  if (process.env.ESBUILD_BUILD === 'content') {
    import('@content/components/bookmark/activeIcon').then((module) => module.updateActiveIcon());
    import('@content/components/bookmark/dragAndDrop').then((module) => {
      module.enableDragAndDrop(parentFolderUl);
    });
  }
};

export const moveBookmark = ({ id, parentId, oldParentId, index, oldIndex }) => {
  const bookmark = getBookmark(id);
  const parentFolderUl = getFolderUl(parentId);

  if (parentId === oldParentId) {
    parentFolderUl.children[index][index > oldIndex ? 'after' : 'before'](bookmark);
  } else {
    if (!index) parentFolderUl.prepend(bookmark);
    else parentFolderUl.children[index - 1].after(bookmark);

    updateFolderIcon(getBookmark(oldParentId));
    updateFolderIcon(getBookmark(parentId));
  }

  if (process.env.ESBUILD_BUILD === 'content') $('.bookmark__link', bookmark)?.focus();
};

export const changeBookmark = ({ id, title, url }) => {
  const bookmarkLink = $(`#b${id} .bookmark__link`);
  if (url) {
    bookmarkLink.href = url;
    bookmarkLink.title = `${title} | ${url}`;
  } else {
    bookmarkLink.title = title;
  }

  const bookmarkTitle = $('.bookmark__title', bookmarkLink);
  bookmarkTitle.textContent = title;

  if (process.env.ESBUILD_BUILD === 'content') {
    import('@content/components/bookmark/activeIcon').then((module) => module.updateActiveIcon());
  }
};
