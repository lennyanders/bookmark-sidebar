<script setup>
  import BaseInput from '@components/form/BaseInput.vue';
  import BaseButton from '@components/form/BaseButton.vue';

  import { ref, defineProps } from 'vue';
  import { i18n } from '@shared/utils';
  import { actions } from '@api';
  import { hideModal } from '@components/modal';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const title = ref(document.title);
  const url = ref(location.href);

  const createBm = (createFolder) => {
    actions.createBm({
      parentId: props.bm.id,
      title: title.value,
      url: createFolder === true ? null : url.value,
    });
    hideModal();
  };
</script>

<template>
  <form @submit.prevent="createBm">
    <h2 class="modal__headline">{{ i18n('addBookmark') }}</h2>

    <BaseInput v-model="title" :text="i18n('title')" required />
    <BaseInput v-model="url" type="url" :text="i18n('url')" required />

    <div class="modal__actions">
      <BaseButton @click.passive="createBm(true)" :text="i18n('addFolder')" />
      <BaseButton type="submit" :text="i18n('addBookmark')" />
    </div>
  </form>
</template>
