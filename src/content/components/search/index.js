import { sidebar } from '@sidebar-root';

export const enableSearchbar = () => {
  /** @type {HTMLInputElement} */
  const searchbar = sidebar.querySelector('.js-searchbar');

  const bookmarkList = sidebar.querySelector('main > ul');
  const searchResultList = document.createElement('ul');

  searchbar.addEventListener(
    'input',
    () => {
      if (!searchbar.value) {
        bookmarkList.hidden = false;
        searchResultList.remove();
        return;
      }

      /** @type {NodeListOf<HTMLElement} */
      const bookmarkLinks = bookmarkList.querySelectorAll(
        `.bookmark__link[title*="${searchbar.value}" i]`,
      );

      searchResultList.innerHTML = '';
      searchResultList.append(
        ...[...bookmarkLinks].map((link) => link.closest('.bookmark').cloneNode(true)),
      );

      if (!bookmarkLinks.hidden) {
        bookmarkList.hidden = true;
        bookmarkList.after(searchResultList);
      }
    },
    { passive: true },
  );

  searchbar.addEventListener(
    'keyup',
    (event) => {
      if (event.key !== 'Escape') return;

      searchbar.value = '';
      searchbar.dispatchEvent(new InputEvent('input'));
      searchbar.blur();
    },
    { passive: true },
  );
};
