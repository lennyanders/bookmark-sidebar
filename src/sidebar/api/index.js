import { nextTick } from 'vue';
import { store } from '@store';

// connect to middleware (background script)
const port = chrome.runtime.connect({ name: 'bmBar' });

// listen to events and update data
port.onMessage.addListener(
  async ({
    bm,
    allFolders,
    barLeft,
    barWidth,
    barTheme,
    editBookmarkOnRightClick,
  }) => {
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
  updateRootBm(id) {
    port.postMessage({ type: 'setShownBm', id: id });
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

  saveBarLeft() {
    port.postMessage({ type: 'setBarLeft', barLeft: store.barLeft });
  },
  saveBarWidth() {
    port.postMessage({ type: 'setBarWidth', barWidth: store.barWidth });
  },
  saveActiveTheme() {
    port.postMessage({
      type: 'setBarTheme',
      barTheme: store.activeTheme,
    });
  },
  saveEditBookmarkOnRightClick() {
    port.postMessage({
      type: 'seteditBookmarkOnRightClick',
      editBookmarkOnRightClick: store.editBookmarkOnRightClick,
    });
  },
};
