<template>
  <transition name="modal">
    <div
      v-if="showModal"
      @click="close"
      @keyup.esc="close"
      tabindex="0"
      class="modal"
    >
      <div @click.stop class="modal__content">
        <modal-edit-bm
          v-if="type === 'edit'"
          @close-modal="close"
          :id="data.id"
          :title="data.title"
          :url="data.url"
        ></modal-edit-bm>
        <modal-add-bm
          v-else
          @close-modal="close"
          :parent-id="data.parentId"
        ></modal-add-bm>
      </div>
    </div>
  </transition>
</template>

<script>
  import Event from '../../Event';

  import ModalEditBm from './ModalEditBm.vue';
  import ModalAddBm from './ModalAddBm.vue';

  export default {
    components: {
      ModalEditBm,
      ModalAddBm
    },
    data() {
      return {
        showModal: false,
        type: null,
        data: null
      };
    },
    methods: {
      close() {
        this.showModal = false;
      }
    },
    created() {
      Event.$on('show-modal', (type, data) => {
        this.type = type;
        this.data = data;
        this.showModal = true;
        this.$nextTick(() => this.$el.focus());
      });
    }
  };
</script>

<style lang="scss">
  .modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
    z-index: 2;

    &-enter-active,
    &-leave-active {
      transition: opacity 0.2s ease;
    }

    &-enter,
    &-leave-to {
      opacity: 0;
    }

    &__content {
      padding: 16px;
      background-color: var(--bg-color);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
      cursor: auto;
    }

    &__headline {
      margin-bottom: 16px;
    }

    &__title {
      display: block;
    }

    &__input {
      width: 100%;
      margin-bottom: 16px;
      color: var(--input-color);
      transition: color 0.2s ease;

      &:disabled {
        color: var(--disabled-input-color);
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
    }

    &__action {
      &:not(&--option) {
        padding: 5px;
        margin-left: 8px;
        background-color: var(--bm-focus-color);
      }

      &--option {
        flex: 1;
      }

      &__label {
        display: block;
        position: relative;
        padding: 5px 8px;
        margin-left: 16px;

        &::before,
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          cursor: pointer;
        }

        &::before {
          box-sizing: border-box;
          left: -16px;
          margin-top: -8px;
          width: 16px;
          height: 16px;
          border: 1px solid var(--bm-focus-color);
        }

        &::after {
          left: -12px;
          margin-top: -4px;
          width: 8px;
          height: 8px;
          background-color: var(--bm-focus-color);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
      }

      &__checkbox:focus + &__label::before {
        outline: -webkit-focus-ring-color auto 1px;
      }

      &__checkbox:checked + &__label::after {
        opacity: 1;
      }
    }
  }
</style>