import { ref, computed } from 'vue';

import { store } from '../../store';
import { actions } from '../../api';

export default (props, childrenVisible) => {
  const root = ref(null);

  const dragstart = e => {
    if (childrenVisible) childrenVisible.value = false;

    store.dragY = e.offsetY;
    store.dragEl = root.value;
  };

  const dragenter = e => {
    if (store.dragEl !== root.value) store.newBmParentId = props.bm.parentId;

    root.value.parentNode.insertBefore(
      store.dragEl,
      e.offsetY < store.dragY ? root.value.nextElementSibling : root.value
    );
  };

  const dragend = () => {
    const newParent =
      props.bm.parentId !== store.newBmParentId ? store.newBmParentId : 0;

    let newIndex = [...root.value.parentNode.children].indexOf(root.value);
    if (!newParent && newIndex > props.bm.index) newIndex++;

    actions.moveBm({
      id: props.bm.id,
      ...(newParent && { parentId: newParent }),
      index: newIndex
    });
  };

  return {
    root,
    dragstart,
    dragenter,
    dragend
  };
};
