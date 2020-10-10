<template>
  <div class="file-overlay" :class="{ 'file-overlay--visible': visible }">
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
        @input="$event.target.form.requestSubmit(), $event.target.form.reset()"
      />
    </form>
  </div>
</template>

<script setup="props">
  import { reactive, ref, toRef } from 'vue';

  export const visible = ref(false);

  export const hideOverlay = () => (visible.value = false);
  const showOverlay = () => (visible.value = true);

  addEventListener('dragenter', showOverlay, { passive: true });
  addEventListener(
    'dragleave',
    (event) => !event.relatedTarget && hideOverlay(),
    { passive: true },
  );

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
    padding: 1.5rem;
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr;
    gap: 3rem;
    background-color: var(--bg-color);
    font-size: 2rem;
    z-index: 2147483647;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.125s ease, visibility 0.125s;

    &--visible {
      transition: opacity 0.25s ease, visibility 0.25s;
      opacity: 1;
      visibility: visible;
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
        top: 0.5rem;
        right: 0.5rem;
        bottom: 0.5rem;
        left: 0.5rem;
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
