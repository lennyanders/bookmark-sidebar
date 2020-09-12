<template>
  <form @submit.prevent="updateBm">
    <h2 class="modal__headline">Lesezeichen bearbeiten</h2>

    <BaseInput v-model="newTitle" text="Titel" required />
    <BaseInput v-if="newUrl" v-model="newUrl" text="Link" required />

    <div class="modal__actions">
      <BaseButton @click="removeBm" text="delete" />
      <BaseButton type="submit" text="update" />
    </div>
  </form>
</template>

<script>
  import BaseInput from '../form/BaseInput';
  import BaseButton from '../form/BaseButton';

  export default {
    props: {
      bm: {
        type: Object,
        required: true,
      },
    },
    components: {
      BaseInput,
      BaseButton,
    },
  };
</script>

<script setup="props">
  import { ref } from 'vue';
  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export const newTitle = ref(props.bm.title);
  export const newUrl = ref(props.bm.url);

  export const updateBm = () => {
    actions.editBm({
      id: props.bm.id,
      title: newTitle.value,
      url: newUrl.value,
    });
    mutations.hideModal();
  };
  export const removeBm = () => {
    actions.removeBm(props.bm.id);
    mutations.hideModal();
  };
</script>
