import { sidebar } from '@sidebar-root';

export const enablePrevNextFocus = () => {
  const bookmarkLinksLiveCollection = sidebar.getElementsByClassName('bookmark__link');

  sidebar.addEventListener('keydown', (event) => {
    const delta = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!delta) return;

    const bookmarkLink = event.target.closest('.bookmark')?.querySelector('.bookmark__link');

    if (!bookmarkLink) return;

    event.preventDefault(); // how can I disable scroll on website while maintaining proper/smooth scroll in the sidebar

    const visibleBookmarks = [...bookmarkLinksLiveCollection].filter((el) => el.offsetParent);

    const currentIndex = visibleBookmarks.indexOf(bookmarkLink);
    if (currentIndex !== -1) visibleBookmarks[currentIndex + delta]?.focus();
  });
};
