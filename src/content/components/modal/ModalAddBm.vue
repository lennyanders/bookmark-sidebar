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

  import { mutations, store } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    components: {
      BaseInput,
      BaseCheckbox,
      BaseButton,
    },
    props: {
      bm: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        title: document.title,
        url: location.href,
        createFolder: false,
      };
    },
    methods: {
      createBm() {
        actions.createBm({
          parentId: this.bm.id,
          title: this.title,
          url: this.createFolder ? '' : this.url,
        });
        mutations.hideModal();
      },
    },
  };
</script>
