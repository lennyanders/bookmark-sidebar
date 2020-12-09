<script setup>
  import ModalAddBm from '@components/modal/ModalAddBm.vue';

  import { markRaw, defineProps } from 'vue';
  import { mutations } from '@store';

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

  const addBm = () => {
    mutations.showModal(markRaw(ModalAddBm), { bm: props.bm });
  };
</script>

<template>
  <button :class="btnClasses" @click.passive="addBm">
    <svg :class="icnClasses" viewBox="0 0 24 24">
      <title>Add bookmark or folder</title>
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  </button>
</template>
