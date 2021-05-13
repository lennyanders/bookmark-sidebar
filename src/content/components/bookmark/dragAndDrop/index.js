import Sortable from 'sortablejs';
import { $$, closest } from '@utils/dom';
import { port } from '@port';

/** @param {HTMLElement} [parent] */
export const enableDragAndDrop = (parent) => {
  $$(':not(#b0) main > ul, .bookmark__children', parent).forEach(enableDragAndDropForFolder);
};

const enableDragAndDropForFolder = (folder) => {
  // only make folder sortable if he not already is
  if (Sortable.get(folder)) return;

  new Sortable(folder, {
    group: 'nested',
    draggable: '.bookmark',
    animation: 100,
    swapThreshold: 0.5,
    dragoverBubble: true,
    // revertOnSpill: true,
    onEnd({ from, to, oldDraggableIndex, newDraggableIndex, item }) {
      const id = item.id.slice(1);
      let index = newDraggableIndex;
      let parentId;

      if (from === to) {
        if (newDraggableIndex > oldDraggableIndex) index++;
      } else {
        parentId = closest(to, '.bookmark, .sidebar').id.slice(1);
      }

      port.postMessage({ type: 'moveBookmark', id, index, parentId });
    },
  });
};
