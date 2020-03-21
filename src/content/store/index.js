import merge from 'lodash/merge';

import Vue from 'vue';
import { $root } from '../main';

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
  activeBm: '0',

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

const findBm = (
  id,
  delta = 0,
  includeChildren = true,
  bms = store.bm.children
) => {
  for (let i = 0; i < bms.length; i++) {
    if (bms[i].id === id) {
      if (delta > 0) {
        // select first children when children are open
        if (
          includeChildren &&
          bms[i].childrenVisible &&
          bms[i].children.length
        ) {
          return bms[i].children[0];
        }
        const res = bms[i + delta];
        if (res) return res;

        const res2 = findBm(bms[i].parentId, 1, false);
        if (res2) return res2;
      }

      if (delta < 0) {
        const res = bms[i + delta];
        if (res) return res;

        const res2 = findBm(bms[i].parentId, 0);
        if (res2) return res2;
      }

      return bms[i];
    }
    if (bms[i].children) {
      const res = findBm(id, delta, includeChildren, bms[i].children);
      if (res) return res;
    }
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
    store.bm = merge({}, store.bm, bm);
    $root.$emit('bookmarks-updated');
  },
  setAllFolders(folders) {
    store.allFolders = folders;
  },
  setActiveBm(id) {
    store.activeBm = id;
  },
  walkActiveBmBy(delta) {
    store.activeBm = findBm(store.activeBm, delta)?.id;
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
