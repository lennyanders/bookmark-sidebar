import { store, mutations } from '../store/index';

// connect to backend (background script)
const port = chrome.runtime.connect({ name: 'bmBar' });

// listen to events and update data
port.onMessage.addListener(({ bm, allFolders, barLeft, barWidth }) => {
  mutations.setRootBm(bm);
  mutations.setAllFolders(allFolders);

  mutations.setBarLeft(barLeft);
  mutations.setBarWidth(barWidth);
});

// communicate with backend (background script)
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
  }
};