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
    <template v-if="url">
      <label for="modal-edit-url" class="modal__title">Link</label>
      <input
        type="text"
        id="modal-edit-url"
        class="modal__input"
        v-model="newUrl"
      />
    </template>
    <div class="modal__actions">
      <button type="button" class="modal__action" @click="$emit('close-modal')">
        cancel
      </button>
      <button type="button" class="modal__action" @click="deleteBm">
        delete
      </button>
      <button type="submit" class="modal__action">update</button>
    </div>
  </form>
</template>

<script>
  import store from '../../store';

  export default {
    props: ['id', 'title', 'url'],
    data() {
      return {
        newTitle: this.title,
        newUrl: this.url
      };
    },
    methods: {
      updateBm() {
        store.port.postMessage({
          type: 'update',
          id: this.id,
          title: this.newTitle,
          ...(this.url && { url: this.newUrl })
        });
        this.$emit('close-modal');
      },
      deleteBm() {
        store.port.postMessage({ type: 'remove', id: this.id });
        this.$emit('close-modal');
      }
    }
  };
</script>