<script setup>
  import BaseInput from '@components/form/BaseInput.vue';
  import BaseButton from '@components/form/BaseButton.vue';

  import { ref, defineProps } from 'vue';
  import { store, mutations } from '@store';
  import { actions } from '@api';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const newTitle = ref(props.bm.title);
  const newUrl = ref(props.bm.url);

  const updateBm = () => {
    actions.editBm({
      id: props.bm.id,
      title: newTitle.value,
      url: newUrl.value,
    });
    mutations.hideModal();
  };
  const removeBm = () => {
    actions.removeBm(props.bm.id);
    mutations.hideModal();
  };
</script>

<template>
  <form @submit.prevent="updateBm">
    <h2 class="modal__headline">Lesezeichen bearbeiten</h2>

    <BaseInput v-model="newTitle" text="Titel" required />
    <BaseInput v-if="newUrl" v-model="newUrl" text="Link" required />

    <div class="modal__actions">
      <BaseButton @click.passive="removeBm" text="delete" />
      <BaseButton type="submit" text="update" />
    </div>
  </form>
</template>
