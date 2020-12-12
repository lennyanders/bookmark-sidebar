<script setup>
  import BaseInput from '@components/form/BaseInput.vue';
  import BaseButton from '@components/form/BaseButton.vue';
  import SetCurrentUrl from '@components/actions/SetCurrentUrl.vue';

  import { ref, defineProps } from 'vue';
  import { actions } from '@api';
  import { hideModal } from '@components/modal';

  const props = defineProps({
    bm: {
      type: Object,
      required: true,
    },
  });

  const newTitle = ref(props.bm.title);
  const newUrl = ref(props.bm.url);

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
    if (eventOrCloseModal !== false) hideModal();
  };

  const removeBm = () => {
    actions.removeBm(props.bm.id);
    hideModal();
  };
</script>

<template>
  <form @submit.prevent="updateBm">
    <h2 class="modal__headline">Lesezeichen bearbeiten</h2>

    <BaseInput v-model="newTitle" text="Titel" required />
    <BaseInput
      v-if="typeof newUrl === 'string'"
      v-model="newUrl"
      type="url"
      text="Link"
      required
    >
      <SetCurrentUrl @click.passive="setCurrentUrl" />
    </BaseInput>

    <div class="modal__actions">
      <BaseButton @click.passive="removeBm" text="delete" />
      <BaseButton type="submit" text="update" />
    </div>
  </form>
</template>
