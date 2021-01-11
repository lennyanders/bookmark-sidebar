import { actions } from '@api';

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
      parentId,
    });
  };

  /** @param {PointerEvent} event */
  const pointerDown = (event) => {
    /** @type {Element} */
    const item = event.currentTarget.parentNode;
    let clone;

    /** @param {PointerEvent} event */
    const up = (event) => {
      clearTimeout(lol);

      clone?.after(item);
      clone?.remove();

      item.style.top = '';
      item.classList.remove('bookmark--dragging');
      item.releasePointerCapture(event.pointerId);
      item.removeEventListener('pointermove', move, { passive: true });
    };

    /** @param {PointerEvent} event */
    const move = (event) => {
      console.log(event.clientY);
      item.style.top = `${parseFloat(item.style.top) + event.movementY}px`;

      const hitTest = document.elementFromPoint(event.clientX, event.clientY)?.closest('.bookmark');
      if (!hitTest || hitTest === clone) return;

      console.log(hitTest.querySelector('.bookmark__title').innerHTML);

      hitTest[event.movementY > 0 ? 'after' : 'before'](clone);
    };

    const lol = setTimeout(() => {
      clone = item.cloneNode(true);
      clone.classList.add('bookmark--clone');

      item.before(clone);

      item.style.top = `${item.offsetTop - item.offsetHeight}px`;
      item.classList.add('bookmark--dragging');

      item.setPointerCapture(event.pointerId);

      item.addEventListener('pointermove', move, { passive: true });
    }, 100);

    item.addEventListener('pointerup', up, { passive: true, once: true });
  };

  return { dragstart, dragenter, pointerDown };
};
