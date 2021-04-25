import { $, $$, closest, on } from '@utils/dom';

export const enableSearchbar = () => {
  /** @type {HTMLInputElement} */
  const searchbar = $('.js-searchbar');

  const bookmarkList = $('main > ul');
  const searchResultList = document.createElement('ul');

  on(searchbar, 'input', () => {
    if (!searchbar.value) {
      bookmarkList.hidden = false;
      searchResultList.remove();
      return;
    }

    /** @type {NodeListOf<HTMLElement} */
    const bookmarkLinks = $$(`.bookmark__link[title*="${searchbar.value}" i]`, bookmarkList);

    searchResultList.innerHTML = '';
    searchResultList.append(
      ...[...bookmarkLinks].map((link) => closest(link, '.bookmark').cloneNode(true)),
    );

    if (!bookmarkLinks.hidden) {
      bookmarkList.hidden = true;
      bookmarkList.after(searchResultList);
    }
  });

  on(searchbar, 'keyup', (event) => {
    if (event.key !== 'Escape') return;

    searchbar.value = '';
    searchbar.dispatchEvent(new InputEvent('input'));
    searchbar.blur();
  });
};
