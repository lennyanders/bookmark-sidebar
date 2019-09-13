<template>
  <form @submit.prevent="createBm">
    <h2 class="modal__headline">Lesezeichen hinzufügen</h2>
    <label for="modal-add-title" class="modal__title">Titel</label>
    <input
      type="text"
      id="modal-add-title"
      class="modal__input"
      required
      v-model="title"
    />
    <label for="modal-add-url" class="modal__title">Link</label>
    <input
      type="text"
      id="modal-add-url"
      class="modal__input"
      v-model="url"
      :disabled="createFolder"
      :required="!createFolder"
    />
    <div class="modal__actions">
      <div class="modal__action modal__action--option">
        <input
          type="checkbox"
          id="modal-add-folder"
          class="modal__action__checkbox"
          v-model="createFolder"
        />
        <label for="modal-add-folder" class="modal__action__label"
          >create folder</label
        >
      </div>
      <button type="button" class="modal__action" @click="$emit('close-modal')">
        cancel
      </button>
      <button type="submit" class="modal__action">create</button>
    </div>
  </form>
</template>

<script>
  import store from '../../store';

  export default {
    props: ['parentId'],
    data() {
      return {
        title: document.title,
        url: location.href,
        createFolder: false
      };
    },
    methods: {
      createBm() {
        store.port.postMessage({
          type: 'create',
          parentId: this.parentId,
          title: this.title,
          ...(!this.createFolder && { url: this.url })
        });
        this.$emit('close-modal');
      }
    }
  };
</script>