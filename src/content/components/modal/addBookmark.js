import { postMessage } from '@chrome/runtime/port';
import { getFormdataAsJson } from '@utils';
import { $, closest, on } from '@utils/dom';
import { port } from '@port';
import { showModal, hideModal } from './showHide';

export const enableAddBookmark = () => {
  const modalAddBookmark = $('.js-modal-add-bookmark');
  on('click', (event) => {
    const addButton = event.target.closest('.js-add-bookmark');
    if (!addButton) return;

    const formElements = modalAddBookmark.elements;
    formElements.parentId.value = closest(addButton, '.sidebar, .bookmark').id.slice(1);
    formElements.title.value = document.title;
    formElements.url.value = location.href;

    showModal(modalAddBookmark);
  });

  /** @param {boolean} [createFolder] */
  const createBookmark = (createFolder) => {
    postMessage(port, 'createBookmark', getFormdataAsJson(modalAddBookmark, createFolder && 'url'));
    hideModal();
  };

  on(modalAddBookmark, 'submit', (event) => {
    event.preventDefault();
    createBookmark();
  });

  const addFolderButton = $('.js-modal-add-folder');
  on(addFolderButton, 'click', () => createBookmark(true));
};
