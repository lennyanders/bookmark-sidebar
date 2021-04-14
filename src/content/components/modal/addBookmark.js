import { postMessage } from '@chrome/runtime/port';
import { getFormdataAsJson } from '@utils';
import { sidebar } from '@sidebar-root';
import { port } from '@port';
import { showModal, hideModal } from './showHide';

export const enableAddBookmark = () => {
  const modalAddBookmark = sidebar.querySelector('.js-modal-add-bookmark');
  sidebar.addEventListener(
    'click',
    (event) => {
      const addButton = event.target.closest('.js-add-bookmark');
      if (!addButton) return;

      const formElements = modalAddBookmark.elements;
      formElements.parentId.value = addButton.closest('.sidebar, .bookmark').id.slice(1);
      formElements.title.value = document.title;
      formElements.url.value = location.href;

      showModal(modalAddBookmark);
    },
    { passive: true },
  );

  /** @param {boolean} [createFolder] */
  const createBookmark = (createFolder) => {
    postMessage(port, 'createBookmark', getFormdataAsJson(modalAddBookmark, createFolder && 'url'));
    hideModal();
  };

  modalAddBookmark.addEventListener('submit', (event) => {
    event.preventDefault();
    createBookmark();
  });

  const addFolderButton = sidebar.querySelector('.js-modal-add-folder');
  addFolderButton.addEventListener('click', () => createBookmark(true), { passive: true });
};
