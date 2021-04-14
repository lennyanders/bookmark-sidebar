import { sidebar } from '@sidebar-root';

let modal;
let modalContentChildren;

const setup = () => {
  modal = sidebar.querySelector('.modal');
  modalContentChildren = modal.getElementsByClassName('modal__content');

  modal.querySelector('.js-close-modal').addEventListener('click', hideModal, { passive: true });

  modal.addEventListener('keyup', (event) => event.key === 'Escape' && hideModal(), {
    passive: true,
  });
};

export const showModal = (modalContentChild) => {
  if (!modal) setup();

  for (const content of Array.from(modalContentChildren)) {
    if (content === modalContentChild) content.hidden = false;
    else content.hidden = true;
  }
  modal.classList.add('modal--visible');
  modal.focus();
};

export const hideModal = () => {
  if (!modal) setup();

  modal.classList.remove('modal--visible');
};
