import { $, $$, on } from '@utils/dom';

let modal;
let modalContentChildren;

const setup = () => {
  modal = $('.modal');
  modalContentChildren = $$('.modal__content');

  on($('.js-close-modal'), 'click', hideModal);
  on(modal, 'keyup', (event) => event.key === 'Escape' && hideModal());
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
