import { $$ } from '@utils/dom';

export const updateActiveIcon = () => {
  const { href } = location;

  $$(`.bookmark__link--active:not([href="${href}"])`).forEach((link) => {
    link.classList.remove('bookmark__link--active');
  });

  $$(`.bookmark__link[href="${href}"]`).forEach((link) => {
    link.classList.add('bookmark__link--active');
  });
};
