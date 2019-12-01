<template>
  <div>
    <BaseSelect
      v-model="shownBm"
      :options="allFolders"
      text="Choose the folder that you want to display:"
    />

    <BaseCheckbox
      v-model="barLeft"
      text="Should the Sidebar be on the left side?"
    />

    <BaseRadio
      v-model="activeTheme"
      :options="themes"
      text="Choose your preferred color theme"
    />

    <BaseInput v-model="barWidth" text="Set width of Sidebar" type="number" />
  </div>
</template>

<script>
  import BaseInput from '../form/BaseInput.vue';
  import BaseSelect from '../form/BaseSelect.vue';
  import BaseCheckbox from '../form/BaseCheckbox.vue';
  import BaseRadio from '../form/BaseRadio.vue';

  import { staticStore, store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    components: {
      BaseInput,
      BaseSelect,
      BaseCheckbox,
      BaseRadio
    },
    data() {
      return {
        themes: staticStore.themes
      };
    },
    computed: {
      allFolders: () =>
        store.allFolders.map(folder => {
          folder.value = folder.id;
          folder.text = folder.title;
          return folder;
        }),
      shownBm: {
        get: () => store.bm.id,
        set(val) {
          actions.updateRootBm(val);
        }
      },
      barLeft: {
        get: () => store.barLeft,
        set(val) {
          mutations.setBarLeft(val);
          actions.saveBarLeft();
        }
      },
      activeTheme: {
        get: () => store.activeTheme,
        set(val) {
          mutations.setActiveTheme(val);
          actions.saveActiveTheme();
        }
      },
      barWidth: {
        get: () => store.barWidth,
        set(val) {
          mutations.setBarWidth(val);
          actions.saveBarWidth();
        }
      }
    }
  };
</script>