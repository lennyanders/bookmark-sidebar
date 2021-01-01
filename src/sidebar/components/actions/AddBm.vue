<script setup>
  import { markRaw, defineProps } from 'vue';
  import { i18n } from '@shared/utils';
  import { showModal } from '@components/modal';
  import ModalAddBm from '@components/modal/ModalAddBm.vue';

  const props = defineProps({
    btnClasses: {
      type: Array,
      default: ['bookmark__option'],
    },
    icnClasses: {
      type: Array,
      default: ['bookmark__icon'],
    },
    bm: {
      type: Object,
      required: true,
    },
  });

  const addBm = () => showModal(markRaw(ModalAddBm), { bm: props.bm });
</script>

<template>
  <button v-if="bm.id !== '0'" :class="btnClasses" @click.passive="addBm">
    <svg :class="icnClasses" viewBox="0 0 24 24">
      <title>{{ i18n('addBookmarkTooltip') }}</title>
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  </button>
</template>
