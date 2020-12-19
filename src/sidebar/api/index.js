import { nextTick } from 'vue';
import { store } from '@store';

// connect to middleware (background script)
const port = chrome.runtime.connect({ name: 'bmBar' });

// listen to events and update data
port.onMessage.addListener(
  async ({ bm, allFolders, barLeft, barWidth, barTheme, editBookmarkOnRightClick }) => {
    Object.assign(store, {
      ...(bm && { bm }),
      ...(allFolders && { allFolders }),
      ...(barLeft !== undefined && { barLeft }),
      ...(barWidth && { barWidth }),
      ...(barTheme && { activeTheme: barTheme }),
      ...(editBookmarkOnRightClick !== undefined && {
        editBookmarkOnRightClick,
      }),
    });
    if (bm) {
      // unset and set activeBm to maintain focus
      const activeBm = store.activeBm;
      store.activeBm = null;
      await nextTick();
      store.activeBm = activeBm;
    }
  },
);

// communicate with middleware (background script)
export const actions = {
  setRootBm(id) {
    port.postMessage({ type: 'setShownBm', id });
  },
  createBm(bm) {
    port.postMessage({ type: 'create', ...bm });
  },
  editBm(bm) {
    port.postMessage({ type: 'update', ...bm });
  },
  moveBm(bm) {
    port.postMessage({ type: 'move', ...bm });
  },
  removeBm(id) {
    port.postMessage({ type: 'remove', id });
  },

  setBarLeft(barLeft) {
    port.postMessage({ type: 'setBarLeft', barLeft });
  },
  setBarWidth(barWidth) {
    port.postMessage({ type: 'setBarWidth', barWidth });
  },
  setActiveTheme(barTheme) {
    port.postMessage({
      type: 'setBarTheme',
      barTheme,
    });
  },
  setEditBookmarkOnRightClick(editBookmarkOnRightClick) {
    port.postMessage({
      type: 'setEditBookmarkOnRightClick',
      editBookmarkOnRightClick,
    });
  },
  reset() {
    port.postMessage({ type: 'reset' });
  },
};
