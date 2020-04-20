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
    showOptionsOnRightClick
  }) => {
    store.bm = bm;
    store.allFolders = allFolders;

    store.barLeft = barLeft;
    mutations.setBarWidth(barWidth);
    store.activeTheme = barTheme;
    store.showOptionsOnRightClick = showOptionsOnRightClick;

    // unset and set activeBm to maintain focus
    const activeBm = store.activeBm;
    store.activeBm = null;
    requestAnimationFrame(() => (store.activeBm = activeBm));
  }
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
      barTheme: store.activeTheme
    });
  },
  saveShowOptionsOnRightClick() {
    port.postMessage({
      type: 'setShowOptionsOnRightClick',
      showOptionsOnRightClick: store.showOptionsOnRightClick
    });
  }
};

let count = 0;
export const request = {
  uid: () => count++
};
