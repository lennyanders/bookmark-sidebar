import { reactive } from 'vue';

export const state = reactive({
  visible: false,
  component: null,
  componentProps: null,
  prevFocus: null,
});

export const showModal = (component, componentProps) => {
  state.visible = true;
  state.component = component;
  state.componentProps = componentProps;
  state.prevFocus =
    document.activeElement?.closest('.bookmark')?.querySelector('.bookmark__link') ||
    document.activeElement;
};

export const hideModal = () => {
  state.visible = false;
  state.component = null;
  state.componentProps = null;
  state.prevFocus?.focus();
};
