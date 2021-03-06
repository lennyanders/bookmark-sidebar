import Sortable from 'sortablejs';
import { actions } from '@api';
import { store } from '@store';
import { watchEffect } from 'vue';

/**
 * @param {HTMLElement} newContainer
 */
export const addFolder = (newContainer) => {
  const sortable = new Sortable(newContainer, {
    group: 'nested',
    draggable: '.bookmark',
    animation: 100,
    swapThreshold: 0.5,
    onEnd({ from, to, oldDraggableIndex, newDraggableIndex, item }) {
      const bmId = item.__vueParentComponent.props.bm.id;

      let newIndex = newDraggableIndex;
      let newParentId;

      if (from === to) {
        if (newDraggableIndex > oldDraggableIndex) newIndex++;
      } else {
        newParentId = to.__vueParentComponent.props.bm.id;
      }

      actions.moveBm({
        id: bmId,
        index: newIndex,
        parentId: newParentId,
      });
    },
  });

  watchEffect(() => {
    sortable.option('disabled', store.isSearching);
  });
};
