<template>
  <button :class="btnClasses" @click.passive="addBm">
    <svg :class="icnClasses" viewBox="0 0 24 24">
      <title>Add bookmark or folder</title>
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  </button>
</template>

<script>
  export default {
    props: {
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
    },
  };
</script>

<script setup="props">
  import { markRaw } from 'vue';
  import { mutations } from '../../store';
  import ModalAddBm from '../modal/ModalAddBm';

  export const addBm = () => {
    mutations.showModal(markRaw(ModalAddBm), { bm: props.bm });
  };
</script>
