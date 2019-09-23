import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state: {
    barVisible: true,
    url: location.href,
    isSearching: false,
    bm: null,
    port: chrome.runtime.connect({ name: 'bmBar' }),
    dragY: null,
    dragEl: null,
    newBmParentId: null
  },
  getters: {
    flattenedBms: state => {
      let children = [];
      JSON.stringify(state.bm.children, (_, nested) => {
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
    hideBar(state) {
      state.barVisible = false;
    },
    toggleBarVisibility(state) {
      state.barVisible = !state.barVisible;
    },
    updateUrl(state) {
      state.url = location.href;
    },
    startSearching(state) {
      state.isSearching = true;
    },
    stopSearching(state) {
      state.isSearching = false;
    },
    //
    // Bookmark modifications
    //
    setRootBm(state, bm) {
      state.bm = bm;
    },
    createBm(state, bm) {
      state.port.postMessage({ type: 'create', ...bm });
    },
    editBm(state, bm) {
      state.port.postMessage({ type: 'update', ...bm });
    },
    moveBm(state, bm) {
      state.port.postMessage({ type: 'move', ...bm });
    },
    removeBm(state, id) {
      state.port.postMessage({ type: 'remove', id });
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
  }
});

store.state.port.onMessage.addListener(({ tree }) => {
  if (tree) store.commit('setRootBm', tree);
});

window.addEventListener('toggleBar', () => {
  store.commit('updateUrl');
  store.commit('toggleBarVisibility');
});

window.addEventListener('hideBar', () => {
  store.commit('hideBar');
});

export default store;
