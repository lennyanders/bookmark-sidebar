<template>
  <transition name="modal">
    <div
      v-if="modalVisible"
      class="modal"
      tabindex="-1"
      @click="hideModal"
      @keyup.esc="hideModal"
      ref="modal"
    >
      <div @click.stop class="modal__layer">
        <button class="modal__close" @click="hideModal" title="Close"></button>
        <component
          :is="modalComponent"
          v-bind="modalComponentProps"
          class="modal__content"
        />
      </div>
    </div>
  </transition>
</template>

<script setup="props">
  import { ref, toRef, watchEffect, nextTick } from 'vue';
  import { store, mutations } from '../../store/index';

  export const modalVisible = toRef(store, 'modalVisible');
  export const modalComponent = toRef(store, 'modalComponent');
  export const modalComponentProps = toRef(store, 'modalComponentProps');

  export const hideModal = mutations.hideModal;

  export const modal = ref(null);
  watchEffect(async () => {
    if (modalVisible.value) {
      await nextTick();
      modal.value.focus();
    }
  });
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

    &-enter-active,
    &-leave-active {
      transition: opacity 0.25s ease;

      .modal__layer {
        transition: transform 0.25s ease;
      }
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;

      .modal__layer {
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
