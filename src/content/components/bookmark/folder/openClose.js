import { sidebar } from '@sidebar-root';

/**
 * @param {HTMLUListElement} children
 * @param {number} [min]
 */
export const openFolder = (children, min) => {
  children.hidden = false;
  children.style.height = '0';
  children.style.overflow = 'hidden';

  children.style.height = `${children.scrollHeight || min || 0}px`;
  children.addEventListener(
    'transitionend',
    () => {
      if (!min) children.style.height = '';
      children.style.overflow = '';
    },
    { once: true, passive: true },
  );
};

/** @param {HTMLUListElement} children */
export const closeFolder = (children) => {
  children.style.height = `${children.scrollHeight}px`;
  children.style.overflow = 'hidden';

  children.scrollHeight; // tirgger style computation to start transition
  children.style.height = '0';

  children.addEventListener(
    'transitionend',
    () => {
      children.style.height = '';
      children.style.overflow = '';
      children.hidden = true;
    },
    { once: true, passive: true },
  );
};

export const enableClickOpenCloseFolder = () => {
  sidebar.addEventListener(
    'click',
    (event) => {
      const childrenUl = event.target
        .closest('.js-toggle-folder-children')
        ?.closest('.bookmark')
        ?.querySelector('.bookmark__children');

      if (!childrenUl) return;

      if (childrenUl.hidden) openFolder(childrenUl);
      else closeFolder(childrenUl);
    },
    { passive: true },
  );
};

export const enableDragoverOpenFolder = () => {
  /** @type {NodeJS.Timeout} */
  let dragoverTimout;
  /** @type {HTMLElement} */
  let dragOverFolder;

  sidebar.addEventListener(
    'dragover',
    (event) => {
      const folder = event.target.closest('.bookmark');
      const childrenUl = folder?.querySelector(':scope > .bookmark__children[hidden]');
      dragOverFolder = childrenUl;
      if (!childrenUl || dragoverTimout) return;

      dragoverTimout = setTimeout(() => {
        if (childrenUl === dragOverFolder) openFolder(childrenUl, 32);
        dragoverTimout = null;
      }, 750);
    },
    { passive: true },
  );
};
