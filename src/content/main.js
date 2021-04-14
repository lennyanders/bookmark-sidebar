import { onMessage } from '@chrome/runtime/port';
import { Positions, Themes } from '@shared/consts/settings';
import { root, shadowRoot, sidebar, setSidebar } from '@sidebar-root';
import { port } from '@port';
import { enableResizer } from '@components/resizer';
import { enableBookmarkFeatures } from '@components/bookmark';
import { enableDragAndDrop } from '@components/bookmark/dragAndDrop';
import { enableModal } from '@components/modal';
import { enableSearchbar } from '@components/search';

/** @param {boolean} [force] */
const toggleSidebarVisibility = (force) => {
  const added = sidebar.classList.toggle(
    'sidebar--invisible',
    typeof force === 'boolean' ? !force : undefined,
  );
  if (added) return;

  sidebar.focus();
  const { href } = location;
  shadowRoot
    .querySelectorAll(`.bookmark__link--active:not([href="${href}"])`)
    .forEach((link) => link.classList.remove('bookmark__link--active'));

  shadowRoot
    .querySelectorAll(`.bookmark__link[href="${href}"]`)
    .forEach((link) => link.classList.add('bookmark__link--active'));
};

onMessage(port, 'sidebar', ({ bookmarkSidebarHtml }) => {
  shadowRoot.innerHTML = bookmarkSidebarHtml;
  setSidebar();

  onMessage(port, 'toggleSidebarVisibility', () => toggleSidebarVisibility());

  /** @param {HTMLElement} bookmark */
  const updateFolderIcon = (bookmark) => {
    bookmark
      ?.querySelector('.bookmark__icon use')
      ?.setAttribute(
        'href',
        `#folder${
          bookmark.querySelector('.bookmark__children').children.length ? '' : '-empty'
        }-icon`,
      );
  };

  onMessage(port, 'removeBookmark', ({ id }) => {
    const bookmark = shadowRoot.getElementById(`b${id}`);
    const parentBookmark = bookmark.parentNode.closest('.bookmark');
    bookmark.remove();
    updateFolderIcon(parentBookmark);
  });

  onMessage(port, 'createBookmark', ({ parentId, index, bookmarkHtml }) => {
    const parentFolderUl = shadowRoot.querySelector(`#b${parentId} ul`);

    if (!index) parentFolderUl.insertAdjacentHTML('afterbegin', bookmarkHtml);
    else parentFolderUl.children[index - 1].insertAdjacentHTML('afterend', bookmarkHtml);

    updateFolderIcon(parentFolderUl.closest('.bookmark'));
    enableDragAndDrop(parentFolderUl);
  });

  onMessage(port, 'moveBookmark', ({ id, parentId, oldParentId, index, oldIndex }) => {
    const bookmark = shadowRoot.getElementById(`b${id}`);
    const parentFolderUl = shadowRoot.querySelector(`#b${parentId} ul`);

    if (parentId === oldParentId) {
      return parentFolderUl.children[index][index > oldIndex ? 'after' : 'before'](bookmark);
    }

    if (!index) parentFolderUl.prepend(bookmark);
    else parentFolderUl.children[index - 1].after(bookmark);

    updateFolderIcon(shadowRoot.getElementById(`b${oldParentId}`));
    updateFolderIcon(shadowRoot.getElementById(`b${parentId}`));
  });

  onMessage(port, 'changeBookmark', ({ id, title, url }) => {
    const bookmarkLink = shadowRoot.querySelector(`#b${id} .bookmark__link`);
    if (url) {
      bookmarkLink.href = url;
      bookmarkLink.title = `${title} | ${url}`;
    } else {
      bookmarkLink.title = title;
    }

    const bookmarkTitle = bookmarkLink.querySelector('.bookmark__title');
    bookmarkTitle.textContent = title;
  });

  onMessage(port, 'newFolder', ({ newFolderHtml }) => {
    shadowRoot
      .querySelector('.js-modal-settings [name="sidebarShwonBookmark"]')
      .insertAdjacentHTML('beforeend', newFolderHtml);
  });

  onMessage(port, 'folderRemoved', ({ folderId }) => {
    shadowRoot
      .querySelector(`.js-modal-settings [name="sidebarShwonBookmark"] > [value="${folderId}"]`)
      .remove();
  });

  onMessage(port, 'settingsChanged', (changes) => {
    /** @type {HTMLFormElement} */
    const modalSettings = shadowRoot.querySelector('.js-modal-settings');

    if (changes.sidebarShwonBookmark) {
      const main = shadowRoot.querySelector('main');
      if (changes.bookmarksHtml) {
        main.innerHTML = changes.bookmarksHtml;
        enableDragAndDrop();
      } else {
        const children = shadowRoot.querySelector(`#b${changes.sidebarShwonBookmark} ul`);
        if (children) {
          children.removeAttribute('class');
          children.hidden = false;
          main.innerHTML = '';
          main.append(children);
        }
      }
      sidebar.id = `b${changes.sidebarShwonBookmark}`;
      modalSettings.elements.sidebarShwonBookmark.value = changes.sidebarShwonBookmark;
    }

    if (changes.sidebarPosition) {
      sidebar.classList.toggle('sidebar--left', changes.sidebarPosition === Positions.left);
      modalSettings.elements.sidebarPosition.value = changes.sidebarPosition;
    }

    if (changes.theme) {
      const { oldValue, newValue } = changes.theme;
      if (oldValue !== Themes.system) sidebar.classList.remove(`sidebar--${oldValue}`);
      if (newValue !== Themes.system) sidebar.classList.add(`sidebar--${newValue}`);
      modalSettings.elements.theme.value = newValue;
    }

    if (changes.sidebarWidth) {
      sidebar.style.width = `${changes.sidebarWidth}px`;
      modalSettings.elements.sidebarWidth.value = changes.sidebarWidth;
    }
  });

  window.addEventListener(
    'click',
    (event) => !root.contains(event.target) && toggleSidebarVisibility(false),
    { passive: true },
  );
  window.addEventListener(
    'blur',
    () => document.activeElement?.tagName === 'IFRAME' && toggleSidebarVisibility(false),
    { passive: true },
  );

  sidebar.addEventListener('keydown', (event) => event.stopPropagation(), { passive: true });

  enableBookmarkFeatures();
  enableResizer();
  enableModal();
  enableSearchbar();

  document.body.append(root);
  toggleSidebarVisibility(true);
});
