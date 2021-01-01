import { markRaw } from 'vue';
import { showModal } from '@components/modal';
import ModalEditBm from '@components/modal/ModalEditBm.vue';

export default (props) => {
  const contextmenu = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (['1', '2'].some((id) => id === props.bm.id)) return;

    event.preventDefault();
    showModal(markRaw(ModalEditBm), { bm: props.bm });
  };

  return { contextmenu };
};
