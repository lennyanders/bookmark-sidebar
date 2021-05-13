import { on } from '@utils/dom';
import { removeBookmark, createBookmark, moveBookmark, changeBookmark } from '@shared/bookmark';
import { newFolder, folderRemoved } from '@shared/settings';
import { root, shadowRoot, sidebar, setSidebar } from '@sidebar-root';
import { port } from '@port';
import { enableResizer } from '@components/resizer';
import { enableBookmarkFeatures } from '@components/bookmark';
import { settingsChanged } from '@components/settings/settingsChanged';
import { enableModal } from '@components/modal';
import { enableSearchbar } from '@components/search';
import { updateActiveIcon } from '@components/bookmark/activeIcon';

/** @param {boolean} [force] */
const toggleSidebarVisibility = (force) => {
  const added = sidebar.classList.toggle(
    'sidebar--invisible',
    typeof force === 'boolean' ? !force : undefined,
  );
  if (added) return;

  updateActiveIcon();
  sidebar.focus();
};

const handlers = {
  toggleSidebarVisibility,
  removeBookmark,
  createBookmark,
  moveBookmark,
  changeBookmark,
  newFolder,
  folderRemoved,
  settingsChanged,
  sidebar: (msg) => {
    shadowRoot.innerHTML = msg.bookmarkSidebarHtml;
    setSidebar();

    on(window, 'click', (event) => !root.contains(event.target) && toggleSidebarVisibility(false));
    on(
      window,
      'blur',
      () => document.activeElement?.tagName === 'IFRAME' && toggleSidebarVisibility(false),
    );
    on('keydown', (event) => event.stopPropagation());

    enableBookmarkFeatures();
    enableResizer();
    enableModal();
    enableSearchbar();

    document.body.append(root);
    toggleSidebarVisibility(true);
  },
};

port.onMessage.addListener((msg) => handlers[msg.type]?.(delete msg.type && msg));
