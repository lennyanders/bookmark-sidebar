import { onMessage } from '@chrome/runtime/port';
import { Positions, Themes } from '@shared/consts/settings';
import { $, $$ } from '@utils/dom';
import { removeBookmark, createBookmark, moveBookmark, changeBookmark } from '@shared/bookmark';
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

  $$(`.bookmark__link--active:not([href="${href}"])`).forEach((link) => {
    link.classList.remove('bookmark__link--active');
  });

  $$(`.bookmark__link[href="${href}"]`).forEach((link) => {
    link.classList.add('bookmark__link--active');
  });
};

onMessage(port, 'sidebar', ({ bookmarkSidebarHtml }) => {
  shadowRoot.innerHTML = bookmarkSidebarHtml;
  setSidebar();

  onMessage(port, 'toggleSidebarVisibility', toggleSidebarVisibility);
  onMessage(port, 'removeBookmark', removeBookmark);
  onMessage(port, 'createBookmark', createBookmark);
  onMessage(port, 'moveBookmark', moveBookmark);
  onMessage(port, 'changeBookmark', changeBookmark);

  onMessage(port, 'newFolder', ({ newFolderHtml }) => {
    $('.js-modal-settings [name="sidebarShwonBookmark"]').insertAdjacentHTML(
      'beforeend',
      newFolderHtml,
    );
  });

  onMessage(port, 'folderRemoved', ({ folderId }) => {
    $(`.js-modal-settings [name="sidebarShwonBookmark"] > [value="${folderId}"]`).remove();
  });

  onMessage(port, 'settingsChanged', (changes) => {
    /** @type {HTMLFormElement} */
    const modalSettings = $('.js-modal-settings');

    if (changes.sidebarShwonBookmark) {
      const main = $('main');
      if (changes.bookmarksHtml) {
        main.innerHTML = changes.bookmarksHtml;
        enableDragAndDrop();
      } else {
        const children = $(`#b${changes.sidebarShwonBookmark} ul`);
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
