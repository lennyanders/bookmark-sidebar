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

<script>
  import BaseInput from '../form/BaseInput';
  import BaseCheckbox from '../form/BaseCheckbox';
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
      BaseCheckbox,
      BaseButton,
    },
  };
</script>

<script setup="props">
  import { ref } from 'vue';
  import { mutations, store } from '../../store/index';
  import { actions } from '../../api/index';

  export const title = ref(document.title);
  export const url = ref(location.href);
  export const createFolder = ref(false);

  export const createBm = () => {
    actions.createBm({
      parentId: props.bm.id,
      title: title.value,
      url: createFolder.value ? null : url.value,
    });
    mutations.hideModal();
  };
</script>
