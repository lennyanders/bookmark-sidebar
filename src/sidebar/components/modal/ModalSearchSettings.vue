<script setup>
  import BaseRadio from '@components/form/BaseRadio.vue';

  import { search } from '@shared/settings.json';
  import { store } from '@store';
</script>

<template>
  <div>
    <BaseRadio v-model="store.searchSortOrder" :options="search.sort" text="How to sort?" />

    <BaseRadio v-model="store.searchLocation" :options="search.location" text="Where to search?" />

    <BaseRadio v-model="store.searchFilter" :options="search.filter" text="What to search?" />
  </div>
</template>
