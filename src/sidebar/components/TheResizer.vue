<script setup>
  import PseudoWindow from '@shared/components/PseudoWindow';
  import { ref, computed } from 'vue';
  import { store, mutations } from '@store';
  import { actions } from '@api';

  const dragging = ref(false);
  const cssLeft = computed(() => (store.barLeft ? '100%' : '0'));
  const cssScaleX = computed(() => (dragging.value ? '4' : '1'));

  const resize = ({ x }) => {
    store.barWidth = store.barLeft ? x : document.body.scrollWidth - x;
  };
  const stopResizing = () => {
    actions.setBarWidth(store.barWidth);
    dragging.value = false;
  };
</script>

<template>
  <PseudoWindow v-if="dragging" @mousemove.passive="resize" @mouseup.passive="stopResizing" />
  <div class="resizer" @mousedown.passive="dragging = true" />
</template>

<style lang="scss">
  .resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: v-bind(cssLeft);
    width: 0.25em;
    transform: translateX(-50%) scaleX(v-bind(cssScaleX));
    cursor: col-resize;
    z-index: 2;
  }
</style>
