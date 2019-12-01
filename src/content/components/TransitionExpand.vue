<script>
  export default {
    functional: true,
    render: (createElement, { props, children }) =>
      createElement(
        'transition',
        {
          props: {
            name: props.name
          },
          on: {
            enter(el) {
              el.style.height = 'auto';
              const height = el.scrollHeight;
              el.style.height = 0;
              setTimeout(() => {
                el.style.height = height + 'px';
              });
            },
            afterEnter(el) {
              el.style.height = 'auto';
            },
            leave(el) {
              const height = el.scrollHeight;
              el.style.height = height + 'px';
              setTimeout(() => {
                el.style.height = 0;
              });
            }
          }
        },
        children
      )
  };
</script>
