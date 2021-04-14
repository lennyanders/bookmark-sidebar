import Sortable from 'sortablejs';
import { postMessage } from '@chrome/runtime/port';
import { sidebar } from '@sidebar-root';
import { port } from '@port';

/** @param {HTMLElement} [parent] */
export const enableDragAndDrop = (parent = sidebar) => {
  parent
    .querySelectorAll(':not(#b0) main > ul, .bookmark__children')
    .forEach(enableDragAndDropForFolder);
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
        parentId = to.closest('.bookmark, .sidebar').id.slice(1);
      }

      postMessage(port, 'moveBookmark', { id, index, parentId });
    },
  });
};
