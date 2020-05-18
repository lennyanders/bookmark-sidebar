import { actions } from '../../api';

let dragBm;

export default (props, childrenVisible) => {
  const dragstart = () => {
    if (childrenVisible) childrenVisible.value = false;

    dragBm = props.bm;
  };

  const dragenter = () => {
    if (dragBm.id === props.bm.id) {
      dragBm = props.bm;
      return;
    }

    const parentId = props.bm.parentId;

    let index = props.bm.index;
    if (parentId === dragBm.parentId && index > dragBm.index) {
      index++;
    }

    actions.moveBm({
      id: dragBm.id,
      index,
      parentId
    });
  };

  return { dragstart, dragenter };
};
