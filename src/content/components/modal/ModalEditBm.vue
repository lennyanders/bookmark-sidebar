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
  import BaseInput from '../form/BaseInput.vue';
  import BaseButton from '../form/BaseButton.vue';

  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    components: {
      BaseInput,
      BaseButton
    },
    data() {
      return {
        newTitle: store.modalBm.title,
        newUrl: store.modalBm.url
      };
    },
    computed: {
      bmId: () => store.modalBm.id
    },
    methods: {
      updateBm() {
        actions.editBm({
          id: this.bmId,
          title: this.newTitle,
          url: this.newUrl
        });
        mutations.hideModal();
      },
      removeBm() {
        actions.removeBm(this.bmId);
        mutations.hideModal();
      }
    }
  };
</script>