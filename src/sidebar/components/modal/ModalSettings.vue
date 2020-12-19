<script setup>
  import BaseInput from '@components/form/BaseInput.vue';
  import BaseSelect from '@components/form/BaseSelect.vue';
  import BaseCheckbox from '@components/form/BaseCheckbox.vue';
  import BaseRadio from '@components/form/BaseRadio.vue';
  import BaseButton from '@components/form/BaseButton.vue';

  import { computed } from 'vue';
  import { store } from '@store';
  import { actions } from '@api';
  import { themes } from '@shared/settings.json';

  const allFolders = computed(() =>
    store.allFolders.map(({ id, title }) => ({
      value: id,
      text: title,
    })),
  );
</script>

<template>
  <form @reset.prevent="actions.reset">
    <BaseSelect
      :modelValue="store.bm.id"
      @update:modelValue="actions.setRootBm"
      :options="allFolders"
      text="Choose the folder that you want to display:"
    />

    <BaseCheckbox
      :modelValue="store.barLeft"
      @update:modelValue="actions.setBarLeft"
      text="Should the Sidebar be on the left side?"
    />

    <BaseCheckbox
      :modelValue="store.editBookmarkOnRightClick"
      @update:modelValue="actions.setEditBookmarkOnRightClick"
      text="Open boomark options on right click?"
    />

    <BaseRadio
      :modelValue="store.activeTheme"
      @update:modelValue="actions.setActiveTheme"
      :options="themes"
      text="Choose your preferred color theme"
    />

    <BaseInput
      :modelValue="store.barWidth"
      @update:modelValue="actions.setBarWidth"
      text="Set width of Sidebar"
      type="number"
    />

    <div class="modal__actions">
      <BaseButton type="reset" text="Reset" />
    </div>
  </form>
</template>
