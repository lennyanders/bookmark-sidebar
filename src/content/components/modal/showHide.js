import { $, $$ } from '@utils/dom';

let modal;
let modalContentChildren;

const setup = () => {
  modal = $('.modal');
  modalContentChildren = $$('.modal__content');

  $('.js-close-modal').addEventListener('click', hideModal, { passive: true });

  modal.addEventListener('keyup', (event) => event.key === 'Escape' && hideModal(), {
    passive: true,
  });
};

export const showModal = (modalContentChild) => {
  if (!modal) setup();

  for (const content of modalContentChildren) content.hidden = content !== modalContentChild;

  modal.classList.add('modal--visible');
  modal.focus();
};

export const hideModal = () => {
  if (!modal) setup();

  modal.classList.remove('modal--visible');
};
