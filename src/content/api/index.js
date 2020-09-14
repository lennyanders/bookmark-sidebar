import { store, mutations } from '../store/index';

// connect to middleware (background script)
const port = chrome.runtime.connect({ name: 'bmBar' });

// listen to events and update data
port.onMessage.addListener(
  ({
    bm,
    allFolders,
    barLeft,
    barWidth,
    barTheme,
    editBookmarkOnRightClick,
  }) => {
    if (bm) {
      store.bm = bm;
    }
    if (allFolders) {
      store.allFolders = allFolders;
    }
    if (barLeft) {
      store.barLeft = barLeft;
    }
    if (barWidth) {
      mutations.setBarWidth(barWidth);
    }
    if (barTheme) {
      store.activeTheme = barTheme;
    }
    if (editBookmarkOnRightClick) {
      store.editBookmarkOnRightClick = editBookmarkOnRightClick;
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
