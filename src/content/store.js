import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const port = chrome.runtime.connect({ name: 'bmBar' });

const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state: {
    barLeft: false,
    barWidth: 320,
    modalVisible: false,
    // modalVisible: true,
    modalType: '',
    // modalType: 'ModalSettings',
    modalBm: null,
    bm: null,
    allFolders: null,
    dragY: null,
    dragEl: null,
    newBmParentId: null
  },
  getters: {
    flattenedBms: ({ bm: { children: bms } }) => {
      let children = [];
      JSON.stringify(bms, (_, nested) => {
        if (nested && nested.title) children.push(nested);
        return nested;
      });
      return children;
    }
  },
  mutations: {
    //
    // Sidebar appearance
    //
    showModal(state, { type, bm }) {
      state.modalVisible = true;
      state.modalType = type;
      if (bm) state.modalBm = bm;
    },
    hideModal(state) {
      state.modalVisible = false;
    },
    setBarLeft(state, barLeft) {
      state.barLeft = barLeft;
    },
    setBarWidth(state, width) {
      if (width >= 280 && width <= window.screen.width / 2)
        state.barWidth = width;
    },
    //
    // Bookmark modifications
    //
    setAllFolders(state, allFolders) {
      state.allFolders = allFolders;
    },
    setRootBm(state, bm) {
      state.bm = bm;
    },
    //
    // Bookmark drag and drop
    //
    setDragY(state, y) {
      state.dragY = y;
    },
    setDragEl(state, el) {
      state.dragEl = el;
    },
    setNewBmParentId(state, parentId) {
      state.newBmParentId = parentId;
    }
  },
  actions: {
    updateRootBm(_, id) {
      port.postMessage({ type: 'setShownBm', id: id });
    },
    createBm(_, bm) {
      port.postMessage({ type: 'create', ...bm });
    },
    editBm(_, bm) {
      port.postMessage({ type: 'update', ...bm });
    },
    moveBm(_, bm) {
      port.postMessage({ type: 'move', ...bm });
    },
    removeBm(_, id) {
      port.postMessage({ type: 'remove', id });
    },

    saveBarLeft({ state: { barLeft } }) {
      port.postMessage({ type: 'setBarLeft', barLeft });
    },
    saveBarWidth({ state: { barWidth } }) {
      port.postMessage({ type: 'setBarWidth', barWidth });
    }
  }
});

port.onMessage.addListener(({ bm, allFolders, barLeft, barWidth }) => {
  store.commit('setRootBm', bm);
  store.commit('setAllFolders', allFolders);
  store.commit('setBarLeft', barLeft);
  store.commit('setBarWidth', barWidth);
});

export default store;
