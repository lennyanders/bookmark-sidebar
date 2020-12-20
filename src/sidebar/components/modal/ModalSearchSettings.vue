<script setup>
  import BaseRadio from '@components/form/BaseRadio.vue';

  import { search } from '@shared/settings.json';
  import { store } from '@store';
  import { i18n } from '@shared/utils';
</script>

<template>
  <div>
    <BaseRadio v-model="store.searchSortOrder" :options="search.sort" :text="i18n('sortOrder')" />

    <BaseRadio
      v-model="store.searchLocation"
      :options="search.location"
      :text="i18n('searchLocation')"
    />

    <BaseRadio v-model="store.searchFilter" :options="search.filter" :text="i18n('searchFilter')" />
  </div>
</template>
