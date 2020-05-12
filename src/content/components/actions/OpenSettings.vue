<template>
  <button class="header__icon header__icon--primary" @click="showSettings">
    <svg viewBox="0 0 24 24">
      <title>Open Settings</title>
      <path
        d="M3 17v2h6v-2H3M3 5v2h10V5H3m10 16v-2h8v-2h-8v-2h-2v6h2M7 9v2H3v2h4v2h2V9H7m14 4v-2H11v2h10m-6-4h2V7h4V5h-4V3h-2v6z"
      />
    </svg>
  </button>
</template>

<script>
  import { markRaw } from 'vue';
  import ModalSettings from '../modal/ModalSettings';

  import { mutations } from '../../store/index';

  export default {
    methods: {
      showSettings() {
        mutations.showModal(markRaw(ModalSettings));
      }
    }
  };
</script>