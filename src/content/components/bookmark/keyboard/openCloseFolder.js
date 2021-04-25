import { $, closest, on } from '@utils/dom';
import { openFolder, closeFolder } from '../folder';

export const enableLeftRightKeyCloseOpenFolder = () => {
  on('keydown', (event) => {
    if (event.key !== 'ArrowRight') return;

    const closedChildren = $(
      ':scope > .bookmark__children[hidden]',
      event.target.closest('.bookmark'),
    );

    if (closedChildren) openFolder(closedChildren);
  });

  on('keydown', (event) => {
    if (event.key !== 'ArrowLeft') return;

    let openedChildren = $('.bookmark__children:not([hidden])', event.target.closest('.bookmark'));

    if (!openedChildren) {
      openedChildren = event.target.closest('.bookmark__children:not([hidden])');
      if (!openedChildren) return;

      $('.bookmark__link', closest(openedChildren, '.bookmark'))?.focus();
    }

    closeFolder(openedChildren);
  });
};
