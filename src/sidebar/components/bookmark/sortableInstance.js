import Sortable from 'sortablejs/modular/sortable.core.esm';
import { actions } from '@api';
import { store } from '@store';
import { ref, watchEffect } from 'vue';

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
      const bm = item.__vueParentComponent.props.bm;

      let newIndex = newDraggableIndex;
      let newParentId;

      if (from === to) {
        if (newDraggableIndex > oldDraggableIndex) newIndex++;
      } else {
        const newParentBm = to.__vueParentComponent.props.bm;
        newParentId = newParentBm.id;

        newParentBm.children.splice(newDraggableIndex, 0, bm);
        item.remove();
      }

      transitionSorting.value = false;
      actions.moveBm({
        id: bm.id,
        index: newIndex,
        parentId: newParentId,
      });
    },
  });

  watchEffect(() => {
    sortable.option('disabled', store.isSearching);
  });
};

export const transitionSorting = ref(true);
