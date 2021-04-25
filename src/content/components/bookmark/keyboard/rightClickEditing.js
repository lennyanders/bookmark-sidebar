import { $, on } from '@utils/dom';

export const enableRightClickEditing = () => {
  on('contextmenu', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const bookmark = event.target.closest('.bookmark');
    if (!bookmark) return;

    event.preventDefault();
    $('.js-edit-bookmark, .js-edit-folder', bookmark)?.click();
  });
};
