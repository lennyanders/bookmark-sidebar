<script>
import BookmarkBookmark from './BookmarkBookmark.vue';
import BookmarkFolder from './BookmarkFolder.vue';

export default {
  functional: true,
  render: (createElement, { data, props }) =>
    createElement(props.bm.url ? BookmarkBookmark : BookmarkFolder, data)
};
</script>
