import Sortable from 'sortablejs';
import { actions } from '@api';

/**
 * @param {HTMLElement} newContainer
 */
export const addFolder = (newContainer) => {
  new Sortable(newContainer, {
    group: 'nested',
    draggable: '.bookmark',
    animation: 100,
    swapThreshold: 0.5,
    onEnd({ from, to, oldDraggableIndex, newDraggableIndex, item }) {
      const draggedBm = item.__vueParentComponent.props.bm;

      let newIndex = newDraggableIndex;
      let newParentId;

      if (from === to) {
        newParentId = draggedBm.parentId;

        if (newDraggableIndex > oldDraggableIndex) newIndex++;
      } else {
        newParentId = to.__vueParentComponent.props.bm.id;
      }

      actions.moveBm({
        id: draggedBm.id,
        index: newIndex,
        parentId: newParentId,
      });
    },
  });
};
