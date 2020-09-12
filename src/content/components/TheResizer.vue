<template>
  <div
    class="resizer"
    :class="{ 'resizer--right': barLeft, 'resizer--resizing': dragging }"
    @mousedown.prevent="startResizing"
  />
</template>

<script setup="props">
  import { ref, toRef } from 'vue';
  import { store, mutations } from '../store';
  import { actions } from '../api';

  export const dragging = ref(false);
  export const barLeft = toRef(store, 'barLeft');

  const resize = (event) => {
    mutations.setBarWidth(
      barLeft.value ? event.x : document.body.scrollWidth - event.x,
    );
  };
  const stopResizing = () => {
    actions.saveBarWidth();
    dragging.value = false;
    removeEventListener('mousemove', resize);
    removeEventListener('mouseup', stopResizing);
  };
  export const startResizing = () => {
    dragging.value = true;
    addEventListener('mousemove', resize);
    addEventListener('mouseup', stopResizing);
  };
</script>

<style lang="scss">
  .resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 4px;
    transform: translateX(-50%);
    cursor: col-resize;
    z-index: 2;

    &--right {
      left: auto;
      right: 0;
      transform: translateX(50%);
    }

    &--resizing {
      width: 20px;
    }
  }
</style>
