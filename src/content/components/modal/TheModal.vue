<template>
  <transition name="modal">
    <div
      v-if="modalVisible"
      class="modal"
      tabindex="0"
      @click="hideModal"
      @keyup.esc="hideModal"
    >
      <div @click.stop class="modal__layer">
        <button class="modal__close" @click="hideModal" title="Close"></button>
        <component :is="modalType" class="modal__content" />
      </div>
    </div>
  </transition>
</template>

<script>
  import ModalEditBm from './ModalEditBm.vue';
  import ModalAddBm from './ModalAddBm.vue';
  import ModalSettings from './ModalSettings.vue';

  import { store, mutations } from '../../store/index';

  export default {
    components: {
      ModalEditBm,
      ModalAddBm,
      ModalSettings
    },
    computed: {
      modalVisible: () => store.modalVisible,
      modalType: () => store.modalType
    },
    methods: {
      hideModal: mutations.hideModal
    },
    watch: {
      modalVisible(val) {
        if (!val) return;

        this.$nextTick(() => this.$el.focus());
      }
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
    z-index: 1;

    $mdl: &;

    &-enter-active,
    &-leave-active {
      transition: opacity 0.25s ease;

      #{$mdl}__layer {
        transition: transform 0.25s ease;
      }
    }

    &-enter,
    &-leave-to {
      opacity: 0;

      #{$mdl}__layer {
        transform: translateY(100%);
      }
    }

    &__layer {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 8px 16px 64px 16px;
      background-color: var(--bg-color);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
      cursor: auto;
    }

    &__close {
      position: relative;
      display: block;
      height: 20px;
      width: 40px;
      margin: 0 auto;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 7px;
        width: 18px;
        height: 6px;
        border-radius: 2px;
        background-color: var(--font-color);
        transition: transform 0.25s cubic-bezier(0.5, -0.5, 0.5, 1.5);
      }

      &::before {
        right: 50%;
        margin-right: -2px;
        transform: rotate(-20deg);
      }

      &::after {
        left: 50%;
        margin-left: -2px;
        transform: rotate(20deg);
      }

      &:hover {
        &::before {
          transform: rotate(20deg);
        }
        &::after {
          transform: rotate(-20deg);
        }
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    &__content {
      display: grid;
      grid-auto-flow: row;
      grid-row-gap: 20px;
    }
  }
</style>