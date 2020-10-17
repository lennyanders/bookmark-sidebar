import { markRaw } from 'vue';

import ModalEditBm from '../modal/ModalEditBm';

import { mutations } from '../../store/index';

export default (props) => {
  const contextmenu = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    event.preventDefault();
    mutations.showModal(markRaw(ModalEditBm), { bm: props.bm });
  };

  return { contextmenu };
};
