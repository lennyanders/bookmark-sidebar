<template>
  <li class="bookmark" ref="root">
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
      <a
        class="bookmark__link"
        :class="{ 'bookmark__link--active': isOpen }"
        :href="bm.url"
        :title="`${bm.title} | ${bm.url}`"
        @focus.passive="setActiveBm"
        ref="focusableBmPart"
      >
        <img class="bookmark__icon" :src="bm.faviconDataUrl" />
        <span class="bookmark__title" v-text="bm.title" />
      </a>
      <EditBm :bm="bm" />
    </div>
  </li>
</template>

<script>
  import EditBm from '../actions/EditBm';

  export default {
    props: {
      bm: {
        type: Object,
        required: true,
      },
    },
    components: {
      EditBm,
    },
  };
</script>

<script setup="props">
  import { computed } from 'vue';
  import { store } from '../../store';
  import useEditBm from './useEditBm';
  import useKeyboard from './useKeyboard';
  import useDragAndDrop from './useDragAndDrop';
  import useFocus from './useFocus';
  import useIsSearching from './useIsSearching';
  import useEditBookmarkOnRightClick from './useEditBookmarkOnRightClick';

  export const { contextmenu } = useEditBm(props);
  export const { keydown } = useKeyboard(props);
  export const { dragstart, dragenter } = useDragAndDrop(props);
  export const { focusableBmPart, setActiveBm } = useFocus(props);
  export const { isSearching } = useIsSearching();
  export const { editBookmarkOnRightClick } = useEditBookmarkOnRightClick();
  export const isOpen = computed(() => props.bm.url === store.url);
</script>
