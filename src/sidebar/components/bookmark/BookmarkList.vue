<script setup>
  import BaseBookmark from '@components/bookmark/BaseBookmark.vue';
  import { defineProps } from 'vue';
  import { store } from '@store';
  import { actions } from '@api';

  const props = defineProps({
    bms: {
      type: Array,
      required: true,
    },
  });

  // action -> 0: moveBy, 1: moveIn, 2: moveOut
  const move = (event, bm, delta, action) => {
    if (store.isSearching) return;

    const nextBm =
      action === 2 ? props.bms.find(({ id }) => id === bm.parentId) : props.bms[bm.index + delta];
    if (!nextBm) return;

    if (action === 1 && nextBm.children) {
      actions.moveBm({
        id: bm.id,
        index: delta > 0 ? 0 : nextBm.children.length,
        parentId: nextBm.id,
      });
      return event.stopPropagation();
    }

    actions.moveBm({
      id: bm.id,
      index: delta > 0 ? nextBm.index + 1 : nextBm.index,
      parentId: nextBm.parentId,
    });
    event.stopPropagation();
  };

  const go = (event, bm, delta, includeChildren) => {
    let nextBm;
    if (includeChildren) {
      nextBm = bm.children[0];
    } else {
      const curBmIndex = props.bms.findIndex(({ id }) => id === bm.id);
      if (curBmIndex !== -1) nextBm = props.bms[curBmIndex + delta];
    }
    if (!nextBm) return;

    store.activeBm = nextBm.id;
    event.stopPropagation();
  };

  // FIX: in search multiple bookmarks with the same id can appear, so focus can break (always first found focused) (especially in folders)
</script>

<template>
  <TransitionGroup tag="ul">
    <BaseBookmark v-for="bm of bms" :key="bm.id" :bm="bm" @go="go" @move="move" />
  </TransitionGroup>
</template>

<style lang="scss" scoped>
  .v-move {
    transition: transform 0.2s ease-in-out;
  }
</style>
