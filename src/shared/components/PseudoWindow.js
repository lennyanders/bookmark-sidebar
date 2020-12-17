// "inspiration": https://github.com/privatenumber/vue-pseudo-window
import { defineComponent, onBeforeMount, onBeforeUnmount } from 'vue';

export default defineComponent({
  props: {
    document: Boolean,
    body: Boolean,
  },
  setup(props, { attrs }) {
    let target, events;

    onBeforeMount(() => {
      target = props.document ? document : props.body ? document.body : window;

      events = [];
      for (let name in attrs) {
        if (!name.startsWith('on')) continue;

        const callback = attrs[name];

        const options = {};

        let regexRes;
        while ((regexRes = /Passive$|Once$|Capture$/.exec(name))) {
          name = name.replace(regexRes[0], '');
          options[regexRes[0].toLowerCase()] = true;
        }
        name = name[2].toLowerCase() + name.slice(3);

        target.addEventListener(name, callback, options);
        events.push({ name, callback, options });
      }
    });

    onBeforeUnmount(() => {
      for (const { name, callback, options } of events) {
        target.removeEventListener(name, callback, options);
      }
    });
  },
  render: () => null,
});
