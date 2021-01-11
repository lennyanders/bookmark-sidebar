<script setup>
  import EditBm from '@components/actions/EditBm.vue';
  import { defineProps, defineEmit, computed } from 'vue';
  import { store } from '@store';
  import { getBaseUrl } from '@shared/utils';
  import useEditBm from './useEditBm';
  import useDragAndDrop from './useDragAndDrop';
  import useFocus from './useFocus';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmit(['go', 'move']);

  const bmId = computed(() => props.bm.id);
  const bmIndex = computed(() => props.bm.index);

  const { contextmenu } = useEditBm(props.bm);
  const { dragstart, dragenter, pointerDown } = useDragAndDrop(props);
  const { focusableBmPart, setActiveBm } = useFocus(bmId);

  const isOpen = computed(() => props.bm.url === store.url);
  const faviconDataUrl = computed(() => store.faviconDataUrls[getBaseUrl(props.bm.url)]);
</script>

<template>
  <li class="bookmark">
    <div
      class="bookmark__content"
      @keydown.down.passive.exact="emit('go', $event, bm, 1)"
      @keydown.up.passive.exact="emit('go', $event, bm, -1)"
      @keydown.alt.down.passive.exact="emit('move', $event, bm, 1)"
      @keydown.alt.up.passive.exact="emit('move', $event, bm, -1)"
      @keydown.alt.ctrl.down.passive.exact="emit('move', $event, bm, 1, 1)"
      @keydown.alt.ctrl.up.passive.exact="emit('move', $event, bm, -1, 1)"
      v-on="{
        ...(store.editBookmarkOnRightClick && {
          contextmenu,
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
