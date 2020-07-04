<template>
  <li class="bookmark" ref="root">
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
      <a
        class="bookmark__link"
        :class="{ 'bookmark__link--active': isOpen }"
        :href="bm.url"
        :title="`${bm.title} | ${bm.url}`"
        @focus="setActiveBm"
        ref="focusableBmPart"
      >
        <img class="bookmark__icon" :src="bm.faviconDataUrl" />
        <span class="bookmark__title">{{ bm.title }}</span>
      </a>
      <EditBm :bm="bm" />
    </div>
  </li>
</template>

<script>
  import { computed } from 'vue';

  import { store } from '../../store';

  import useEditBm from './useEditBm';
  import useKeyboard from './useKeyboard';
  import useDragAndDrop from './useDragAndDrop';
  import useFocus from './useFocus';
  import useIsSearching from './useIsSearching';
  import useEditBookmarkOnRightClick from './useEditBookmarkOnRightClick';

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
    setup: (props) => ({
      ...useEditBm(props),
      ...useKeyboard(props),
      ...useDragAndDrop(props),
      ...useFocus(props),
      ...useIsSearching(),
      ...useEditBookmarkOnRightClick(),
      isOpen: computed(() => props.bm.url === store.url),
    }),
  };
</script>
