import { postMessage } from '@chrome/runtime/port';
import { getFormdataAsJson } from '@utils';
import { $, closest, on } from '@utils/dom';
import { getBookmark } from '@shared/bookmark';
import { port } from '@port';
import { showModal, hideModal } from './showHide';
import { showDeltedBookmarkToast } from '@components/toast';

export const enableEditBookmark = () => {
  const modalEditBookmark = $('.js-modal-edit-bookmark');
  const modalEditFolder = $('.js-modal-edit-folder');
  on('click', (event) => {
    const editButton = event.target.closest(`.js-edit-folder, .js-edit-bookmark`);
    if (!editButton) return;

    const form = editButton.classList.contains('js-edit-folder')
      ? modalEditFolder
      : modalEditBookmark;
    const bookmark = closest(editButton, '.bookmark');

    form.elements.id.value = bookmark.id.slice(1);
    form.elements.title.value = $('.bookmark__title', bookmark).textContent;

    if (form.elements.url) form.elements.url.value = $('.bookmark__link', bookmark).href;

    showModal(form);
  });

  /** @param {Event} event */
  const editBookmark = (event) => {
    event.preventDefault();
    postMessage(port, 'updateBookmark', getFormdataAsJson(event.currentTarget));
    hideModal();
  };

  on(modalEditBookmark, 'submit', editBookmark);
  on(modalEditFolder, 'submit', editBookmark);

  on('click', async (event) => {
    const deleteButton = event.target.closest('.js-modal-delete-bookmark');
    if (!deleteButton) return;

    const id = deleteButton.form.elements.id.value;
    const bookmark = getBookmark(id);
    bookmark.hidden = true;
    hideModal();

    const shouldDelete = await showDeltedBookmarkToast();
    if (!shouldDelete) return (bookmark.hidden = false);

    postMessage(port, 'removeBookmark', { id: deleteButton.form.elements.id.value });
  });
};
