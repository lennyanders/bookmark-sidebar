<script setup>
  import { defineProps, computed, toRef } from 'vue';
  import EditBm from '@components/actions/EditBm.vue';

  import { store } from '@store';
  import { getBaseUrl } from '@shared/utils';
  import useEditBm from './useEditBm';
  import useKeyboard from './useKeyboard';
  import useDragAndDrop from './useDragAndDrop';
  import useFocus from './useFocus';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const bmId = toRef(props.bm, 'id');
  const bmIndex = toRef(props.bm, 'index');

  const { contextmenu } = useEditBm(props.bm);
  const { keydown } = useKeyboard(bmId, bmIndex);
  const { dragstart, dragenter } = useDragAndDrop(props);
  const { focusableBmPart, setActiveBm } = useFocus(bmId);

  const isOpen = computed(() => props.bm.url === store.url);
  const faviconDataUrl = computed(() => store.faviconDataUrls[getBaseUrl(props.bm.url)]);
</script>

<template>
  <li class="bookmark">
    <div
      class="bookmark__content"
      :draggable="!store.isSearching"
      @dragenter.stop
      v-on="{
        keydownPassive: keydown,
        ...(store.editBookmarkOnRightClick && {
          contextmenu,
        }),
        ...(!store.isSearching && {
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
        <img class="bookmark__icon" :src="faviconDataUrl" />
        <span class="bookmark__title">{{ bm.title }}</span>
      </a>
      <EditBm :bm="bm" />
    </div>
  </li>
</template>
