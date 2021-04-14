import { sidebar } from '@sidebar-root';

export const enableRightClickEditing = () => {
  sidebar.addEventListener('contextmenu', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const bookmark = event.target.closest('.bookmark');
    if (!bookmark) return;

    event.preventDefault();
    bookmark.querySelector('.js-edit-bookmark, .js-edit-folder')?.click();
  });
};
