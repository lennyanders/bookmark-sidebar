import { customRef } from 'vue';

export const useTrimRef = (value = '') => {
  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue) {
      value = newValue.trim();
      trigger();
    },
  }));
};
