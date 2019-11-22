<template>
  <form @submit.prevent="updateBm">
    <h2 class="modal__headline">Lesezeichen bearbeiten</h2>
    <label for="modal-edit-title" class="modal__title">Titel</label>
    <input
      type="text"
      id="modal-edit-title"
      class="modal__input"
      v-model="newTitle"
    />
    <template v-if="newUrl">
      <label for="modal-edit-url" class="modal__title">Link</label>
      <input
        type="text"
        id="modal-edit-url"
        class="modal__input"
        v-model="newUrl"
      />
    </template>
    <div class="modal__actions">
      <button type="button" class="modal__action" @click="removeBm">
        delete
      </button>
      <button type="submit" class="modal__action">update</button>
    </div>
  </form>
</template>

<script>
  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
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