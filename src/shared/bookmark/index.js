import { $ } from '@utils/dom';

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
