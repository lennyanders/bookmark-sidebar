<template>
  <div>
    <label for="bla">Choose the folder that you want to display:</label>
    <select id="bla" v-model="shownBm">
      <option v-for="{ title, id } of allFolders" :key="id" :value="id">{{
        title
      }}</option>
    </select>

    <br /><label for="">Should the Sidebar be on the left side?</label>
    <input type="checkbox" id="" v-model="barLeft" />

    <label for="">Set width of Sidebar</label>
    <input type="number" v-model="barWidth" name="" id="" />
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState(['allFolders']),
      shownBm: {
        get() {
          return this.$store.state.bm.id;
        },
        set(val) {
          this.$store.dispatch('updateRootBm', val);
        }
      },
      barLeft: {
        get() {
          return this.$store.state.barLeft;
        },
        set(val) {
          this.$store.commit('setBarLeft', val);
          this.$store.dispatch('saveBarLeft');
        }
      },
      barWidth: {
        get() {
          return this.$store.state.barWidth;
        },
        set(val) {
          this.$store.commit('setBarWidth', val);
          this.$store.dispatch('saveBarWidth');
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  input[type='checkbox'] {
    display: block;
    width: 20px;
    height: 20px;
    background-color: #fff;
  }

  select {
    background-color: #333;
  }
</style>