import { mkdir, writeFile } from 'fs/promises';

const dictionaryToCrxDictionarys = async (dictionary) => {
  const dictionarys = {};

  for (const key in dictionary) {
    const dictionaryEntry = dictionary[key];
    for (const lang in dictionaryEntry) {
      if (!dictionarys[lang]) dictionarys[lang] = {};

      dictionarys[lang][key] = { message: dictionaryEntry[lang] };
    }
  }

  for (const lang in dictionarys) {
    await mkdir(`dist/_locales/${lang}`, { recursive: true });
    await writeFile(`dist/_locales/${lang}/messages.json`, JSON.stringify(dictionarys[lang]));
  }
};
/**
 * @param {*} param
 * @returns {import('esbuild').Plugin}
 */
const createPlugin = ({
  dictionaryModulePath = '../../src/dictionary/index.js',
  importFilter = /@dictionary$/,
} = {}) => ({
  name: 'esbuild-plugin-sass',
  setup(build) {
    build.onResolve({ filter: importFilter }, (args) => ({
      path: args.path,
      namespace: 'crx-dictionary',
    }));

    build.onLoad({ filter: importFilter, namespace: 'crx-dictionary' }, async () => {
      try {
        /** @type {string} */
        const aboluteDictionaryModulePath = await import.meta.resolve(dictionaryModulePath);
        const { dictionary } = await import(`${aboluteDictionaryModulePath}#${Date.now()}`);

        dictionaryToCrxDictionarys(dictionary);

        const dictionaryKeys = {};
        for (const key in dictionary) dictionaryKeys[key] = key;

        return {
          loader: 'json',
          contents: JSON.stringify({ dictionaryKeys }),
          watchFiles: [aboluteDictionaryModulePath.replace('file:///', '')],
        };
      } catch (error) {}
    });
  },
});

export default createPlugin;
