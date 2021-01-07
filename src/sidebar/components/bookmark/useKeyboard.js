import { findFocusableBm, findBmToMoveIn } from '@utils';
import { store } from '@store';
import { actions } from '@api';

export default (bmId, bmIndex) => {
  const goBy = (delta) => {
    const { id } = findFocusableBm(bmId.value, delta);
    if (id) store.activeBm = id;
  };

  const moveBy = (delta) => {
    if (delta > 0) delta++;
    actions.moveBm({
      id: bmId.value,
      index: bmIndex.value + delta,
    });
  };

  const moveIn = (delta) => {
    const { id, parentId, children, index } = findBmToMoveIn(bmId.value, delta);

    if (!children) return moveBy(delta);

    if (children.some(({ id }) => id === bmId.value)) {
      return actions.moveBm({
        id: bmId.value,
        parentId,
        index: delta > 0 ? index + 1 : index,
      });
    }

    return actions.moveBm({
      id: bmId.value,
      parentId: id,
      ...(delta > 0 && { index: 0 }),
    });
  };

  const keydown = (event) => {
    const delta = event.code === 'ArrowDown' ? 1 : event.code === 'ArrowUp' && -1;
    if (!delta) return;

    if (!store.isSearching && event.altKey) {
      if (event.ctrlKey) {
        moveIn(delta);
        return;
      }

      moveBy(delta);
      return;
    }

    goBy(delta);
  };

  return { keydown };
};
