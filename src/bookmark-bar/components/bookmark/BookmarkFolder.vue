<script setup>
  import { defineAsyncComponent, defineProps } from 'vue';
  import EditBm from '../actions/EditBm.vue';
  import AddBm from '../actions/AddBm.vue';
  import TransitionExpand from '../TransitionExpand.vue';
  const BaseBookmark = defineAsyncComponent(() => import('./BaseBookmark.vue'));

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  import useEditBm from './useEditBm';
  import useKeyboard from './useKeyboard';
  import useDragAndDrop from './useDragAndDrop';
  import useFocus from './useFocus';
  import useIsSearching from './useIsSearching';
  import useEditBookmarkOnRightClick from './useEditBookmarkOnRightClick';
  import useChildren from './useChildren';

  const { childrenVisible, openChildren, hideChildren } = useChildren(props);
  const { contextmenu } = useEditBm(props);
  const { keydown } = useKeyboard(props);
  const { dragstart, dragenter } = useDragAndDrop(props, childrenVisible);
  const { focusableBmPart, setActiveBm } = useFocus(props, childrenVisible);
  const { isSearching } = useIsSearching();
  const { editBookmarkOnRightClick } = useEditBookmarkOnRightClick();
</script>

<template>
  <li class="bookmark" @keyup.passive.arrow-left="hideChildren">
    <div
      class="bookmark__content"
      :draggable="!isSearching"
      @dragenter.stop
      v-on="{
        keydownPassive: keydown,
        ...(editBookmarkOnRightClick && {
          contextmenu,
        }),
        ...(!isSearching && {
          dragstartPassive: dragstart,
          dragenterPassive: dragenter,
        }),
      }"
    >
      <button
        class="bookmark__link"
        @click.passive="childrenVisible = !childrenVisible"
        @keyup.passive.arrow-right="childrenVisible = true"
        :title="bm.title"
        @focus.passive="setActiveBm"
        ref="focusableBmPart"
      >
        <svg class="bookmark__icon" viewBox="0 0 24 24">
          <path
            v-if="bm.children.length"
            d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"
          />
          <path
            v-else
            d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
          />
        </svg>
        <span class="bookmark__title" v-text="bm.title" />
      </button>
      <AddBm :bm="bm" />
      <EditBm :bm="bm" />
    </div>
    <TransitionExpand v-if="bm.children.length">
      <ul
        class="bookmark__children"
        :hidden="!childrenVisible"
        :key="!childrenVisible"
      >
        <BaseBookmark v-for="bm of bm.children" :key="bm.id" :bm="bm" />
      </ul>
    </TransitionExpand>
  </li>
</template>
