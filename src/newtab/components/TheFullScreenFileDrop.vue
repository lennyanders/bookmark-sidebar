<template>
  <Transition
    name="file-overlay"
    enter-active-class="file-overlay--appearing"
    leave-active-class="file-overlay--disappearing"
    enter-from-class="file-overlay--invisible"
    leave-to-class="file-overlay--invisible"
  >
    <div class="file-overlay" v-show="visible">
      <form
        v-for="form of forms"
        :action="form.action"
        :method="form.method"
        :enctype="form.enctype"
        :target="form.target"
        @submit="form.customSubmitHandler"
        @submit.passive="hideOverlay"
        class="file-overlay__zone"
      >
        <span class="file-overlay__title">Search on {{ form.name }}</span>
        <input
          type="file"
          :name="form.fileFieldName"
          @input="
            $event.target.form.requestSubmit(), $event.target.form.reset()
          "
        />
      </form>
    </div>
  </Transition>
</template>

<script setup="props">
  import { reactive, ref, toRef } from 'vue';

  export const visible = ref(false);

  export const hideOverlay = () => (visible.value = false);
  const showOverlay = () => (visible.value = true);

  addEventListener('dragenter', showOverlay, { passive: true });
  addEventListener('dragover', (event) => event.preventDefault());
  addEventListener(
    'dragleave',
    (event) => !event.relatedTarget && hideOverlay(),
    { passive: true },
  );
  addEventListener('dragend', hideOverlay, { passive: true });
  addEventListener('dragexit', hideOverlay, { passive: true });
  addEventListener('drop', hideOverlay, { passive: true });

  const tinEyeFrom = reactive({
    fileFieldName: 'image',
    name: 'TinEye',
    customSubmitHandler: (event) => {
      event.preventDefault();

      const form = event.target;
      const file = form[tinEyeFrom.fileFieldName].files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState !== 2) return;

        chrome.tabs.getCurrent(({ index }) => {
          chrome.tabs.create(
            {
              index: index + 1,
              url: 'https://tineye.com/',
            },
            ({ id }) => {
              chrome.tabs.executeScript(id, {
                code: `
                  const observer = new MutationObserver(async () => {
                    const input = document.getElementById('upload_box');
                    if (!input) return;

                    observer.disconnect();

                    const imageBuffer = await fetch('${reader.result}').then((result) => result.arrayBuffer());
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(new File([imageBuffer], '${file.name}', {
                      lastModified: ${file.lastModified},
                      type: '${file.type}',
                    }));

                    input.files = dataTransfer.files;
                    input.dispatchEvent(new InputEvent('change'));
                  });

                  observer.observe(document.body, { childList: true, subtree: true });
                `,
              });
            },
          );
        });
      };
      reader.readAsDataURL(file);
    },
  });

  export const forms = [
    {
      action: 'https://saucenao.com/search.php',
      method: 'POST',
      enctype: 'multipart/form-data',
      target: '_blank',
      fileFieldName: 'file',
      name: 'sauceNAO',
    },
    {
      action: 'http://www.iqdb.org/',
      method: 'POST',
      enctype: 'multipart/form-data',
      target: '_blank',
      fileFieldName: 'file',
      name: 'iqdb',
    },
    {
      action: 'https://images.google.de/searchbyimage/upload',
      method: 'POST',
      enctype: 'multipart/form-data',
      target: '_blank',
      fileFieldName: 'encoded_image',
      name: 'Google Images',
    },
    tinEyeFrom,
  ];
</script>

<style lang="scss">
  .file-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0.75em;
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr;
    gap: 1.5em;
    background-color: var(--bg-color);
    font-size: 2em;
    z-index: 2147483647;

    &--appearing {
      transition: opacity 0.25s ease;
    }

    &--disappearing {
      transition: opacity 0.125s ease;
    }

    &--invisible {
      opacity: 0;
    }

    &__zone {
      position: relative;
      display: flex;
      background: linear-gradient(45deg, #304ffe, #2979ff);

      &::before {
        content: '';
        display: block;
        position: absolute;
        background-color: var(--bg-color);
        filter: brightness(0.75);
        top: 0.25em;
        right: 0.25em;
        bottom: 0.25em;
        left: 0.25em;
      }

      > input {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
      }
    }

    &__title {
      position: relative;
      margin: auto;
    }
  }
</style>
