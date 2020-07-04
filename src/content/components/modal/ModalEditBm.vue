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

  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    components: {
      BaseInput,
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
        newTitle: this.bm.title,
        newUrl: this.bm.url,
      };
    },
    methods: {
      updateBm() {
        actions.editBm({
          id: this.bm.id,
          title: this.newTitle,
          url: this.newUrl,
        });
        mutations.hideModal();
      },
      removeBm() {
        actions.removeBm(this.bm.id);
        mutations.hideModal();
      },
    },
  };
</script>
