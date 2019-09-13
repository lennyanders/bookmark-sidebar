<template>
  <li class="bookmark">
    <div
      class="bookmark__content"
      @keydown.down.up.prevent
      @keyup.down="selectNextBm"
      @keyup.up="selectPrevBm"
      ref="dragHandle"
    >
      <button
        @click="showChildren = !showChildren"
        @keyup.right="showChildren = true"
        @keyup.left.stop="hideChildren"
        @mousedown.middle.prevent
        @click.middle="openChildren"
        ref="focusableBmPart"
      >
        <div class="bookmark__link">
          <svg class="bookmark__icon" viewBox="0 0 24 24">
            <path
              v-if="bm.children.length > 0"
              d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"
            />
            <path
              v-else
              d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
            />
          </svg>
          <span class="bookmark__title">{{ bm.title }}</span>
        </div>
      </button>
      <add-bm :parentId="bm.id" />
      <edit-bm :id="bm.id" :title="bm.title" />
    </div>
    <transition-expand v-if="bm.children" :name="'bookmark__children'">
      <ul
        class="bookmark__children"
        v-show="showChildren"
        @keyup.left.stop="hideChildren"
      >
        <bookmark v-for="bm in bm.children" :bm="bm" :key="bm.id" />
      </ul>
    </transition-expand>
  </li>
</template>

<script>
  import Mixin from './Mixin';

  import AddBm from '../actions/AddBm.vue';
  import TransitionExpand from '../TransitionExpand.vue';
  const Bookmark = () => import('./Bookmark.vue');

  export default {
    mixins: [Mixin],
    components: {
      AddBm,
      TransitionExpand,
      Bookmark
    },
    data() {
      return {
        showChildren: false,
        childrenHeight: 0
      };
    },
    methods: {
      openChildren() {
        const urls = [];
        JSON.stringify(this.bm.children, (_, nestedBm) => {
          if (nestedBm && nestedBm.url) urls.push(nestedBm.url);
          return nestedBm;
        });
        console.log(urls);
        if (!urls.length) {
          if (confirm('Dieser Ordner ist leer, möchten Sie ihn löschen?'))
            store.port.postMessage({ type: 'remove', id: this.bm.id });
        } else if (urls.length > 5) {
          if (confirm(`Sie sind dabei ${urls.length} Seiten zu öffnen.`))
            for (const url of urls) window.open(url, '_blank');
        }
      },
      hideChildren() {
        const childrenToHide = this.showChildren
          ? this
          : this.$parent.$parent.$parent;

        childrenToHide.showChildren = false;
        childrenToHide.$refs.focusableBmPart.focus();
      }
    }
  };
</script>