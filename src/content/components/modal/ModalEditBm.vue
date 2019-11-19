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
  export default {
    data() {
      return {
        newTitle: this.$store.state.modalBm.title,
        newUrl: this.$store.state.modalBm.url
      };
    },
    computed: {
      bm() {
        return this.$store.state.modalBm;
      }
    },
    methods: {
      updateBm() {
        this.$store.dispatch('editBm', {
          id: this.bm.id,
          title: this.newTitle,
          url: this.newUrl
        });
        this.$store.commit('hideModal');
      },
      removeBm() {
        this.$store.dispatch('removeBm', this.bm.id);
        this.$store.commit('hideModal');
      }
    }
  };
</script>