import { sidebar } from '@sidebar-root';
import { openFolder, closeFolder } from '../folder';

export const enableLeftRightKeyCloseOpenFolder = () => {
  sidebar.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'ArrowRight') return;

      const closedChildren = event.target
        .closest('.bookmark')
        ?.querySelector(':scope > .bookmark__children[hidden]');

      if (closedChildren) openFolder(closedChildren);
    },
    { passive: true },
  );

  sidebar.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'ArrowLeft') return;

      let openedChildren = event.target
        .closest('.bookmark')
        ?.querySelector('.bookmark__children:not([hidden])');

      if (!openedChildren) {
        openedChildren = event.target.closest('.bookmark__children:not([hidden])');
        if (!openedChildren) return;

        openedChildren.closest('.bookmark')?.querySelector('.bookmark__link')?.focus();
      }

      closeFolder(openedChildren);
    },
    { passive: true },
  );
};
