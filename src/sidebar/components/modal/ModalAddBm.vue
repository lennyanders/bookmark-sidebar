<script setup>
  import BaseInput from '@components/form/BaseInput.vue';
  import BaseCheckbox from '@components/form/BaseCheckbox.vue';
  import BaseButton from '@components/form/BaseButton.vue';

  import { ref, defineProps } from 'vue';
  import { mutations, store } from '@store';
  import { actions } from '@api';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const title = ref(document.title);
  const url = ref(location.href);
  const createFolder = ref(false);

  const createBm = () => {
    actions.createBm({
      parentId: props.bm.id,
      title: title.value,
      url: createFolder.value ? null : url.value,
    });
    mutations.hideModal();
  };
</script>

<template>
  <form @submit.prevent="createBm">
    <h2 class="modal__headline">Lesezeichen hinzufügen</h2>

    <BaseInput v-model="title" text="Titel" required />
    <BaseInput v-model="url" text="Link" :disabled="createFolder" />

    <div class="modal__actions">
      <BaseCheckbox v-model="createFolder" text="create folder" />
      <BaseButton type="submit" text="create" />
    </div>
  </form>
</template>
