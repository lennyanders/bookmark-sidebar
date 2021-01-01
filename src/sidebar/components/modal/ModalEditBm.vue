<script setup>
  import BaseSelect from '@components/form/BaseSelect.vue';
  import BaseInput from '@components/form/BaseInput.vue';
  import BaseButton from '@components/form/BaseButton.vue';
  import SetCurrentUrl from '@components/actions/SetCurrentUrl.vue';

  import { defineProps, ref, computed } from 'vue';
  import { actions } from '@api';
  import { store } from '@store';
  import { hideModal } from '@components/modal';
  import { i18n } from '@shared/utils';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const newTitle = ref(props.bm.title);
  const newUrl = ref(props.bm.url);
  const newParentFolder = ref(props.bm.parentId);

  const setCurrentUrl = () => {
    newUrl.value = location.href;
    updateBm(false);
  };

  const updateBm = (eventOrCloseModal) => {
    if (newTitle.value !== props.bm.title || newUrl.value !== props.bm.url) {
      actions.editBm({
        id: props.bm.id,
        title: newTitle.value,
        url: newUrl.value,
      });
    }
    if (newParentFolder !== props.bm.parentId) {
      actions.moveBm({ id: props.bm.id, parentId: newParentFolder.value });
    }
    if (eventOrCloseModal !== false) hideModal();
  };

  const removeBm = () => {
    actions.removeBm(props.bm.id);
    hideModal();
  };

  const folders = computed(() =>
    store.allFolders
      .filter(({ id }) => id !== '0')
      .map(({ id, title }) => ({ value: id, text: title })),
  );
</script>

<template>
  <form @submit.prevent="updateBm">
    <h2 class="modal__headline">{{ i18n(bm.url ? 'editBookmark' : 'editFolder') }}</h2>

    <BaseSelect v-model="newParentFolder" :options="folders" :text="i18n('parentfolder')" />

    <BaseInput v-model="newTitle" :text="i18n('title')" required />
    <BaseInput v-if="bm.url" v-model="newUrl" type="url" :text="i18n('url')" required>
      <SetCurrentUrl @click.passive="setCurrentUrl" />
    </BaseInput>

    <div class="modal__actions">
      <BaseButton @click.passive="removeBm" :text="i18n('delete')" />
      <BaseButton type="submit" :text="i18n('update')" />
    </div>
  </form>
</template>
