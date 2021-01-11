<script setup>
  import EditBm from '@components/actions/EditBm.vue';
  import AddBm from '@components/actions/AddBm.vue';
  import TransitionExpand from '@components/TransitionExpand.vue';
  import BookmarkList from '@components/bookmark/BookmarkList.vue';
  import { defineProps, defineEmit, computed } from 'vue';
  import { store } from '@store';
  import useEditBm from './useEditBm';
  import useDragAndDrop from './useDragAndDrop';
  import useFocus from './useFocus';
  import useChildren from './useChildren';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmit(['go', 'move']);

  const bmId = computed(() => props.bm.id);
  const bmIndex = computed(() => props.bm.index);

  const { childrenVisible, hideChildren } = useChildren(computed(() => props.bm.children.length));
  const { contextmenu } = useEditBm(props.bm);
  const { dragstart, dragenter, pointerDown } = useDragAndDrop(props, childrenVisible);
  const { focusableBmPart, setActiveBm } = useFocus(bmId, childrenVisible);
</script>

<template>
  <li
    class="bookmark"
    @keyup.passive.arrow-left="hideChildren"
    @keydown.down.passive.exact="emit('go', $event, bm, 1)"
    @keydown.up.passive.exact="emit('go', $event, bm, 0)"
    @keydown.alt.ctrl.down.passive.exact="emit('move', $event, bm.children.slice(-1)[0], 1, 2)"
    @keydown.alt.ctrl.up.passive.exact="emit('move', $event, bm.children[0], 0, 2)"
  >
    <div
      class="bookmark__content"
      @keydown.down.passive.exact="emit('go', $event, bm, 1, childrenVisible)"
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
            :d="
              bm.children.length
                ? 'M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z'
                : 'M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'
            "
          />
        </svg>
        <span class="bookmark__title">{{ bm.title }}</span>
      </button>
      <AddBm :bm="bm" />
      <EditBm :bm="bm" />
    </div>
    <TransitionExpand v-if="bm.children.length">
      <BookmarkList
        class="bookmark__children"
        :bms="bm.children"
        :hidden="!childrenVisible"
        :key="!childrenVisible"
      />
    </TransitionExpand>
  </li>
</template>
