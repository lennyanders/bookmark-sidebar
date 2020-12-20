<script setup>
  import { markRaw, defineProps } from 'vue';
  import { i18n } from '@shared/utils';
  import { showModal } from '@components/modal';
  import ModalEditBm from '@components/modal/ModalEditBm.vue';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const editBm = () => showModal(markRaw(ModalEditBm), { bm: props.bm });
</script>

<template>
  <button class="bookmark__option" @click.passive="editBm">
    <svg class="bookmark__icon" viewBox="0 0 24 24">
      <title>{{ i18n(props.bm.url ? 'editBookmark' : 'editFolder') }}</title>
      <path
        d="M14.06 9l.94.94L5.92 19H5v-.92L14.06 9m3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
      />
    </svg>
  </button>
</template>
