<template>
  <li class="bookmark" ref="root" @keyup.arrow-left="hideChildren">
    <div
      class="bookmark__content"
      :draggable="!isSearching"
      v-on="{
        keydown,
        ...(editBookmarkOnRightClick && {
          contextmenu,
        }),
        ...(!isSearching && {
          dragstart,
          dragenter,
        }),
      }"
    >
      <button
        class="bookmark__link"
        @click="childrenVisible = !childrenVisible"
        @keyup.arrow-right="childrenVisible = true"
        :title="bm.title"
        @focus="setActiveBm"
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
        <span class="bookmark__title">{{ bm.title }}</span>
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

<script>
  import { defineAsyncComponent } from 'vue';

  import useEditBm from './useEditBm';
  import useKeyboard from './useKeyboard';
  import useDragAndDrop from './useDragAndDrop';
  import useFocus from './useFocus';
  import useIsSearching from './useIsSearching';
  import useEditBookmarkOnRightClick from './useEditBookmarkOnRightClick';
  import useChildren from './useChildren';

  import EditBm from '../actions/EditBm';
  import AddBm from '../actions/AddBm';
  import TransitionExpand from '../TransitionExpand';
  const BaseBookmark = defineAsyncComponent(() => import('./BaseBookmark'));

  export default {
    props: {
      bm: {
        type: Object,
        required: true,
      },
    },
    components: {
      EditBm,
      AddBm,
      TransitionExpand,
      BaseBookmark,
    },
    setup: (props) => {
      const { childrenVisible, openChildren, hideChildren } = useChildren(
        props,
      );

      return {
        ...useEditBm(props),
        ...useKeyboard(props),
        ...useDragAndDrop(props, childrenVisible),
        ...useFocus(props, childrenVisible),
        ...useIsSearching(),
        ...useEditBookmarkOnRightClick(),
        childrenVisible,
        hideChildren,
        openChildren,
      };
    },
  };
</script>
