<script setup>
  import { markRaw } from 'vue';
  import { i18n } from '@shared/utils';
  import { showModal } from '@components/modal';
  import { store } from '@store';
  import ModalSearchSettings from '@components/modal/ModalSearchSettings.vue';

  const showSettings = () => store.isSearching && showModal(markRaw(ModalSearchSettings));
</script>

<template>
  <button class="header__icon header__icon--secondary" @click.passive="showSettings">
    <svg viewBox="0 0 24 24">
      <title>{{ i18n('openSearchSettings') }}</title>
      <path d="M3 13h12v-2H3m0-5v2h18V6M3 18h6v-2H3v2z" />
    </svg>
  </button>
</template>
