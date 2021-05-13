import { getFormdataAsJson } from '@utils';
import { $, closest, on } from '@utils/dom';
import { getBookmark } from '@shared/bookmark';
import { editBookmarkNames } from '@shared/consts/inputNames';
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

    form.elements[editBookmarkNames.id].value = bookmark.id.slice(1);
    form.elements[editBookmarkNames.title].value = $('.bookmark__title', bookmark).textContent;

    if (form.elements.url) {
      form.elements[editBookmarkNames.url].value = $('.bookmark__link', bookmark).href;
    }

    showModal(form);
  });

  /** @param {Event} event */
  const editBookmark = (event) => {
    event.preventDefault();
    port.postMessage({ type: 'updateBookmark', ...getFormdataAsJson(event.currentTarget) });
    hideModal();
  };

  on(modalEditBookmark, 'submit', editBookmark);
  on(modalEditFolder, 'submit', editBookmark);

  on('click', async (event) => {
    const deleteButton = event.target.closest('.js-modal-delete-bookmark');
    if (!deleteButton) return;

    const id = deleteButton.form.elements[editBookmarkNames.id].value;
    const bookmark = getBookmark(id);
    bookmark.hidden = true;
    hideModal();

    const shouldDelete = await showDeltedBookmarkToast();
    if (!shouldDelete) return (bookmark.hidden = false);

    port.postMessage({
      type: 'removeBookmark',
      id: deleteButton.form.elements[editBookmarkNames.id].value,
    });
  });
};
