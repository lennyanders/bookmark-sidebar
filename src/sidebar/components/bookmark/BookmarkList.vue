<script setup>
  import BaseBookmark from '@components/bookmark/BaseBookmark.vue';
  import { addFolder, transitionSorting } from './sortableInstance';
  import { ref, onMounted, defineProps } from 'vue';
  import { store } from '@store';
  import { actions } from '@api';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  // action -> 0: moveBy, 1: moveIn, 2: moveOut
  const move = (event, bm, delta, action) => {
    if (store.isSearching) return;

    const nextBm =
      action === 2
        ? props.bm.children.find(({ id }) => id === bm.parentId)
        : props.bm.children[bm.index + delta];

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
      const curBmIndex = props.bm.children.findIndex(({ id }) => id === bm.id);
      if (curBmIndex !== -1) nextBm = props.bm.children[curBmIndex + delta];
    }
    if (!nextBm) return;

    store.activeBm = nextBm.id;
    event.stopPropagation();
  };

  const root = ref(null);
  onMounted(() => addFolder(root.value));

  // FIX: in search multiple bookmarks with the same id can appear, so focus can break (always first found focused) (especially in folders)
</script>

<template>
  <ul ref="root">
    <TransitionGroup :name="transitionSorting ? 'v' : 'no'">
      <BaseBookmark v-for="bm of bm.children" :key="bm.id" :bm="bm" @go="go" @move="move" />
    </TransitionGroup>
  </ul>
</template>

<style lang="scss" scoped>
  .v-move {
    transition: transform 0.1s ease;
  }
</style>
