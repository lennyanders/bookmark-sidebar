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
  import { i18n } from '@shared/utils';

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
      :text="i18n('displayedFolder')"
    />

    <BaseCheckbox
      :modelValue="store.barLeft"
      @update:modelValue="actions.setBarLeft"
      :text="i18n('sidebarOnTheLeft')"
    />

    <BaseCheckbox
      :modelValue="store.editBookmarkOnRightClick"
      @update:modelValue="actions.setEditBookmarkOnRightClick"
      :text="i18n('editBoomarkOrFolderOnRightClick')"
    />

    <BaseRadio
      :modelValue="store.activeTheme"
      @update:modelValue="actions.setActiveTheme"
      :options="themes"
      :text="i18n('colorTheme')"
    />

    <BaseInput
      :modelValue="store.barWidth"
      @update:modelValue="actions.setBarWidth"
      :text="i18n('widthOfSidebar')"
      type="number"
    />

    <div class="modal__actions">
      <BaseButton type="reset" :text="i18n('reset')" />
    </div>
  </form>
</template>
