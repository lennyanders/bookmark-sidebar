import { customRef } from 'vue';

const clamp = (num, min, max) => {
  if (num > max) return max;
  if (num < min) return min;
  return num;
};

export const useClampedRef = (min, max, value = min) => {
  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue) {
      const realNewValue = clamp(newValue, min, max);
      if (realNewValue !== value) {
        value = realNewValue;
        trigger();
      }
    },
  }));
};
