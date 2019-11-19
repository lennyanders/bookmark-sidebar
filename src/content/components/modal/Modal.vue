<template>
  <transition name="modal">
    <div
      v-if="modalVisible"
      class="modal"
      tabindex="0"
      @click="hideModal"
      @keyup.esc="hideModal"
    >
      <div @click.stop class="modal__content">
        <button class="modal__close" @click="hideModal" title="Close"></button>
        <component :is="modalType" />
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';

  import ModalEditBm from './ModalEditBm.vue';
  import ModalAddBm from './ModalAddBm.vue';
  import ModalSettings from './ModalSettings.vue';

  export default {
    components: {
      ModalEditBm,
      ModalAddBm,
      ModalSettings
    },
    computed: mapState(['modalVisible', 'modalType']),
    methods: mapMutations(['hideModal']),
    watch: {
      modalVisible(val) {
        if (val) this.$nextTick(() => this.$el.focus());
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

      #{$mdl}__content {
        transition: transform 0.25s ease;
      }
    }

    &-enter,
    &-leave-to {
      opacity: 0;

      #{$mdl}__content {
        transform: translateY(100%);
      }
    }

    &__content {
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
        background-color: #fff;
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