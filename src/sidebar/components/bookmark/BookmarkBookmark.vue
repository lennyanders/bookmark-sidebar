<script setup>
  import EditBm from '@components/actions/EditBm.vue';

  import { computed, defineProps } from 'vue';
  import { store } from '@store';
  import useEditBm from './useEditBm';
  import useKeyboard from './useKeyboard';
  import useDragAndDrop from './useDragAndDrop';
  import useFocus from './useFocus';
  import useIsSearching from './useIsSearching';
  import useEditBookmarkOnRightClick from './useEditBookmarkOnRightClick';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const { contextmenu } = useEditBm(props);
  const { keydown } = useKeyboard(props);
  const { dragstart, dragenter } = useDragAndDrop(props);
  const { focusableBmPart, setActiveBm } = useFocus(props);
  const { isSearching } = useIsSearching();
  const { editBookmarkOnRightClick } = useEditBookmarkOnRightClick();
  const isOpen = computed(() => props.bm.url === store.url);
</script>

<template>
  <li class="bookmark">
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
