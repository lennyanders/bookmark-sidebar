<script setup>
  import BaseInput from '../form/BaseInput.vue';
  import BaseSelect from '../form/BaseSelect.vue';
  import BaseCheckbox from '../form/BaseCheckbox.vue';
  import BaseRadio from '../form/BaseRadio.vue';

  import { toRef, computed } from 'vue';
  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  const shownBm = computed({
    get: () => store.bm.id,
    set: actions.updateRootBm,
  });
  const allFolders = computed(() => {
    return store.allFolders.map(({ id, title }) => ({
      value: id,
      text: title,
    }));
  });

  const barLeft = computed({
    get: () => store.barLeft,
    set: (value) => {
      store.barLeft = value;
      actions.saveBarLeft();
    },
  });

  const editBookmarkOnRightClick = computed({
    get: () => store.editBookmarkOnRightClick,
    set: (value) => {
      store.editBookmarkOnRightClick = value;
      actions.saveEditBookmarkOnRightClick();
    },
  });

  const themes = store.themes;
  const activeTheme = computed({
    get: () => store.activeTheme,
    set: (value) => {
      store.activeTheme = value;
      actions.saveActiveTheme();
    },
  });

  const barWidth = computed({
    get: () => store.barWidth,
    set: (value) => {
      mutations.setBarWidth(value);
      actions.saveBarWidth();
    },
  });
</script>

<template>
  <div>
    <BaseSelect
      v-model="shownBm"
      :options="allFolders"
      text="Choose the folder that you want to display:"
    />

    <BaseCheckbox
      v-model="barLeft"
      text="Should the Sidebar be on the left side?"
    />

    <BaseCheckbox
      v-model="editBookmarkOnRightClick"
      text="Open boomark options on right click?"
    />

    <BaseRadio
      v-model="activeTheme"
      :options="themes"
      text="Choose your preferred color theme"
    />

    <BaseInput v-model="barWidth" text="Set width of Sidebar" type="number" />
  </div>
</template>
