import { $ } from '@utils/dom';

export const newFolder = ({ newFolderHtml }) => {
  $('.js-modal-settings [name="sidebarShwonBookmark"]').insertAdjacentHTML(
    'beforeend',
    newFolderHtml,
  );
};

export const folderRemoved = ({ folderId }) => {
  $(`.js-modal-settings [name="sidebarShwonBookmark"] > [value="${folderId}"]`).remove();
};
