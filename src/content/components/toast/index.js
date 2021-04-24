import { $ } from '@utils/dom';

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
      toastClose.removeEventListener('click', yeah);
      toastUndo.removeEventListener('click', nah);
      toast.classList.remove('toast--visible');
      resolve(resolveValue);
    };
    const yeah = () => hideToast(true);
    const nah = () => hideToast(false);

    toastClose.addEventListener('click', yeah, { passive: true });
    toastUndo.addEventListener('click', nah, { passive: true });
    setTimeout(yeah, 2500);
  });
};
