import Vue from 'vue';

export const staticStore = {
  themes: [
    {
      value: 'system',
      text: 'System Oriented'
    },
    {
      value: 'light',
      text: 'light'
    },
    {
      value: 'dark',
      text: 'dark'
    }
  ]
};

export const store = Vue.observable({
  barLeft: false,
  barWidth: 320,
  activeTheme: 'system',

  bm: {},
  allFolders: [],

  modalVisible: false,
  modalType: '',
  modalBm: {},

  dragY: null,
  dragEl: null,
  newBmParentId: null
});

// uff
export const getters = {
  flattenedBms: () => {
    let children = [];
    JSON.stringify(store.bm.children, (_, nested) => {
      if (nested && nested.title) children.push(nested);
      return nested;
    });
    return children;
  }
};

export const mutations = {
  setBarLeft(barLeft) {
    store.barLeft = barLeft;
  },
  setBarWidth(width) {
    if (width < 280 || width > window.screen.width / 2) return;

    store.barWidth = width;
  },
  setActiveTheme(option) {
    store.activeTheme = option;
  },

  setRootBm(bm) {
    store.bm = bm;
  },
  setAllFolders(folders) {
    store.allFolders = folders;
  },

  showModal(type, bm) {
    store.modalVisible = true;
    store.modalType = type;

    if (bm) store.modalBm = bm;
  },
  hideModal() {
    store.modalVisible = false;
  },

  setDragY(y) {
    store.dragY = y;
  },
  setDragEl(el) {
    store.dragEl = el;
  },
  setNewBmParentId(id) {
    store.newBmParentId = id;
  }
};
