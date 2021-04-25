import { $, on } from '@utils/dom';

/** @type {HTMLElement} */
let toast;
/** @type {HTMLElement} */
let toastUndo;
/** @type {HTMLElement} */
let toastClose;

const setup = () => {
  toast = $('.toast');
  toastUndo = $('.toast__undo');
  toastClose = $('.toast__close');
};

/** @returns {Promise<boolean>} */
export const showDeltedBookmarkToast = () => {
  if (!toast) setup();

  toast.classList.add('toast--visible');

  return new Promise((resolve) => {
    const hideToast = (resolveValue) => {
      unlistenClose();
      unlistenUndo();
      toast.classList.remove('toast--visible');
      resolve(resolveValue);
    };
    const accept = () => hideToast(true);
    const unlistenClose = on(toastClose, 'click', accept);
    const unlistenUndo = on(toastUndo, 'click', () => hideToast(false));
    setTimeout(accept, 2500);
  });
};
