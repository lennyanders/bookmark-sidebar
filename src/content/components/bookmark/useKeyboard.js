import { findFocusableBm, findBmToMoveIn } from '../../utils';
import { store } from '../../store';
import { actions } from '../../api/index';

export default props => {
  const goBy = delta => {
    const { id } = findFocusableBm(props.bm.id, delta);
    if (id) store.activeBm = id;
  };
  const moveBy = delta => {
    if (delta > 0) delta++;
    actions.moveBm({
      id: props.bm.id,
      index: props.bm.index + delta
    });
  };
  const moveIn = delta => {
    const { id, parentId, children, index } = findBmToMoveIn(
      props.bm.id,
      delta
    );

    if (!children) return moveBy(delta);

    if (children.some(bm => bm.id === props.bm.id)) {
      return actions.moveBm({
        id: props.bm.id,
        parentId,
        index: delta > 0 ? index + 1 : index
      });
    }

    return actions.moveBm({
      id: props.bm.id,
      parentId: id,
      ...(delta > 0 && { index: 0 })
    });
  };

  const keydown = e => {
    const delta = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;

    if (!store.isSearching && e.altKey) {
      if (e.ctrlKey) return moveIn(delta);
      return moveBy(delta);
    }
    goBy(delta);
  };

  return { keydown };
};
