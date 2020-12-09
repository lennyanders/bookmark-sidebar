<script setup>
  import { ref, toRef } from 'vue';
  import { store, mutations } from '../store';
  import { actions } from '../api';

  const dragging = ref(false);
  const barLeft = toRef(store, 'barLeft');

  const resize = ({ x }) => {
    store.barWidth = store.barLeft ? x : document.body.scrollWidth - x;
  };
  const stopResizing = () => {
    actions.saveBarWidth();
    dragging.value = false;
    removeEventListener('mousemove', resize, { passive: true });
    removeEventListener('mouseup', stopResizing, { passive: true });
  };
  const startResizing = () => {
    dragging.value = true;
    addEventListener('mousemove', resize, { passive: true });
    addEventListener('mouseup', stopResizing, { passive: true });
  };
</script>

<template>
  <div
    class="resizer"
    :class="{ 'resizer--right': barLeft, 'resizer--resizing': dragging }"
    @mousedown.passive="startResizing"
  />
</template>

<style lang="scss">
  .resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 0.25em;
    transform: translateX(-50%);
    cursor: col-resize;
    z-index: 2;

    &--right {
      left: auto;
      right: 0;
      transform: translateX(50%);
    }

    &--resizing {
      width: 1.25em;
    }
  }
</style>
