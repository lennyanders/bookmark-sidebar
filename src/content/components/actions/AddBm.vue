<template>
  <button :class="btnClasses" @click="addBm">
    <svg :class="icnClasses" viewBox="0 0 24 24">
      <title>Add bookmark or folder</title>
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  </button>
</template>

<script>
  import { markRaw } from 'vue';
  import ModalAddBm from '../modal/ModalAddBm';

  import { mutations } from '../../store/index';

  export default {
    props: {
      btnClasses: {
        type: Array,
        default: ['bookmark__option']
      },
      icnClasses: {
        type: Array,
        default: ['bookmark__icon']
      },
      bm: {
        type: Object,
        required: true
      }
    },
    methods: {
      addBm() {
        mutations.showModal(markRaw(ModalAddBm), { bm: this.bm });
      }
    }
  };
</script>