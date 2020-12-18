import { store } from '@store';

export const findFocusableBm = (
  id,
  delta = 0,
  includeChildren = true,
  bms = store.filteredBms.children,
) => {
  for (let i = 0; i < bms.length; i++) {
    if (bms[i].id === id) {
      if (delta > 0) {
        if (includeChildren && bms[i].childrenVisible && bms[i].children.length) {
          return bms[i].children[0];
        }
        const res = bms[i + delta] || findFocusableBm(bms[i].parentId, 1, false);
        if (res) return res;
      }

      if (delta < 0) {
        const res = bms[i + delta] || findFocusableBm(bms[i].parentId, 0);
        if (res) return res;
      }

      return bms[i];
    }
    if (bms[i].children) {
      const res = findFocusableBm(id, delta, includeChildren, bms[i].children);
      if (res) return res;
    }
  }
};

export const findBmToMoveIn = (id, delta = 0, bms = store.filteredBms.children) => {
  for (let i = 0; i < bms.length; i++) {
    if (bms[i].id === id) {
      if (delta) {
        const res = bms[i + delta] || findBmToMoveIn(bms[i].parentId);
        if (res) return res;
      }

      return bms[i];
    }
    if (bms[i].children) {
      const res = findBmToMoveIn(id, delta, bms[i].children);
      if (res) return res;
    }
  }
};
