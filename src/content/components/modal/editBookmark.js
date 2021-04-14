import { postMessage } from '@chrome/runtime/port';
import { getFormdataAsJson } from '@utils';
import { sidebar } from '@sidebar-root';
import { port } from '@port';
import { showModal, hideModal } from './showHide';

export const enableEditBookmark = () => {
  const modalEditBookmark = sidebar.querySelector('.js-modal-edit-bookmark');
  const modalEditFolder = sidebar.querySelector('.js-modal-edit-folder');
  sidebar.addEventListener(
    'click',
    (event) => {
      const editButton = event.target.closest(`.js-edit-folder, .js-edit-bookmark`);
      if (!editButton) return;

      const form = editButton.classList.contains('js-edit-folder')
        ? modalEditFolder
        : modalEditBookmark;
      const bookmark = editButton.closest('.bookmark');

      form.elements.id.value = bookmark.id.slice(1);
      form.elements.title.value = bookmark.querySelector('.bookmark__title').textContent;

      if ('url' in form.elements) {
        form.elements.url.value = bookmark.querySelector('.bookmark__link').href;
      }

      showModal(form);
    },
    { passive: true },
  );

  /** @param {Event} event */
  const editBookmark = (event) => {
    event.preventDefault();
    postMessage(port, 'updateBookmark', getFormdataAsJson(event.currentTarget));
    hideModal();
  };

  modalEditBookmark.addEventListener('submit', editBookmark);
  modalEditFolder.addEventListener('submit', editBookmark);

  sidebar.addEventListener(
    'click',
    (event) => {
      const deleteButton = event.target.closest('.js-modal-delete-bookmark');
      if (!deleteButton) return;

      postMessage(port, 'removeBookmark', { id: deleteButton.form.elements.id.value });
      hideModal();
    },
    { passive: true },
  );
};
