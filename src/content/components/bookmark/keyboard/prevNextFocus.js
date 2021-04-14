import { $, $$ } from '@utils/dom';
import { sidebar } from '@sidebar-root';

export const enablePrevNextFocus = () => {
  sidebar.addEventListener('keydown', (event) => {
    const delta = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!delta) return;

    const bookmarkLink = $('.bookmark__link', event.target.closest('.bookmark'));
    if (!bookmarkLink) return;

    event.preventDefault(); // how can I disable scroll on website while maintaining proper/smooth scroll in the sidebar

    const visibleBookmarks = $$('.bookmark__link').filter((el) => el.offsetParent);

    const currentIndex = visibleBookmarks.indexOf(bookmarkLink);
    if (currentIndex !== -1) visibleBookmarks[currentIndex + delta]?.focus();
  });
};
