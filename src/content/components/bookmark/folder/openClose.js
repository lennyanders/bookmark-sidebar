import { $, closest, on, once } from '@utils/dom';

/**
 * @param {HTMLUListElement} children
 * @param {number} [min]
 */
export const openFolder = (children, min) => {
  children.hidden = false;
  children.style.height = '0';
  children.style.overflow = 'hidden';

  children.style.height = `${children.scrollHeight || min || 0}px`;
  once(children, 'transitionend', () => {
    if (!min) children.style.height = '';
    children.style.overflow = '';
  });
};

/** @param {HTMLUListElement} children */
export const closeFolder = (children) => {
  children.style.height = `${children.scrollHeight}px`;
  children.style.overflow = 'hidden';

  children.scrollHeight; // tirgger style computation to start transition
  children.style.height = '0';

  once(children, 'transitionend', () => {
    children.style.height = '';
    children.style.overflow = '';
    children.hidden = true;
  });
};

export const enableClickOpenCloseFolder = () => {
  on('click', (event) => {
    const childrenUl = $(
      '.bookmark__children',
      closest(event.target.closest('.js-toggle-folder-children'), '.bookmark') || null,
    );

    if (!childrenUl) return;

    if (childrenUl.hidden) openFolder(childrenUl);
    else closeFolder(childrenUl);
  });
};

export const enableDragoverOpenFolder = () => {
  /** @type {NodeJS.Timeout} */
  let dragoverTimout;
  /** @type {HTMLElement} */
  let dragOverFolder;

  on('dragover', (event) => {
    const folder = event.target.closest('.bookmark');
    const childrenUl = $(':scope > .bookmark__children[hidden]', folder);
    dragOverFolder = childrenUl;
    if (!childrenUl || dragoverTimout) return;

    dragoverTimout = setTimeout(() => {
      if (childrenUl === dragOverFolder) openFolder(childrenUl, 32);
      dragoverTimout = null;
    }, 750);
  });
};
