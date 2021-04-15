import { $, closest } from '@utils/dom';
import { sidebar } from '@sidebar-root';
import { openFolder, closeFolder } from '../folder';

export const enableLeftRightKeyCloseOpenFolder = () => {
  sidebar.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'ArrowRight') return;

      const closedChildren = $(
        ':scope > .bookmark__children[hidden]',
        event.target.closest('.bookmark'),
      );

      if (closedChildren) openFolder(closedChildren);
    },
    { passive: true },
  );

  sidebar.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'ArrowLeft') return;

      let openedChildren = $(
        '.bookmark__children:not([hidden])',
        event.target.closest('.bookmark'),
      );

      if (!openedChildren) {
        openedChildren = event.target.closest('.bookmark__children:not([hidden])');
        if (!openedChildren) return;

        $('.bookmark__link', closest(openedChildren, '.bookmark'))?.focus();
      }

      closeFolder(openedChildren);
    },
    { passive: true },
  );
};
