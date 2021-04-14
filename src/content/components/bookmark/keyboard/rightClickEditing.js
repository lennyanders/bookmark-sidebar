import { $ } from '@utils/dom';
import { sidebar } from '@sidebar-root';

export const enableRightClickEditing = () => {
  sidebar.addEventListener('contextmenu', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const bookmark = event.target.closest('.bookmark');
    if (!bookmark) return;

    event.preventDefault();
    $('.js-edit-bookmark, .js-edit-folder', bookmark)?.click();
  });
};
