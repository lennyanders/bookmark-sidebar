import { findFocusableBm, findBmToMoveIn } from '@utils';
import { store } from '@store';
import { actions } from '@api';

export default (props) => {
  const goBy = (delta) => {
    const { id } = findFocusableBm(props.bm.id, delta);
    if (id) store.activeBm = id;
  };

  const moveBy = (delta) => {
    if (delta > 0) delta++;
    actions.moveBm({
      id: props.bm.id,
      index: props.bm.index + delta,
    });
  };

  const moveIn = (delta) => {
    const { id, parentId, children, index } = findBmToMoveIn(
      props.bm.id,
      delta,
    );

    if (!children) return moveBy(delta);

    if (children.some((bm) => bm.id === props.bm.id)) {
      return actions.moveBm({
        id: props.bm.id,
        parentId,
        index: delta > 0 ? index + 1 : index,
      });
    }

    return actions.moveBm({
      id: props.bm.id,
      parentId: id,
      ...(delta > 0 && { index: 0 }),
    });
  };

  const keydown = (event) => {
    const delta =
      event.code === 'ArrowDown' ? 1 : event.code === 'ArrowUp' && -1;

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
