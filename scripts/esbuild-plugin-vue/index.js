import { readFile } from 'fs/promises';
import { basename } from 'path';
import { parse, compileScript, compileTemplate, compileStyleAsync } from '@vue/compiler-sfc';
import hashsum from 'hash-sum';

const withMap = (code, map, forCss) => {
  if (!map) return code;

  return `${code}\n${
    forCss ? '/*' : '//'
  }# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(
    JSON.stringify(map),
  ).toString('base64')}${forCss ? '*/' : ''}`;
};

// typing export default dosn't work =(
/**
 * @type {import('esbuild').Plugin}
 */
const esbuildPluginVue = {
  name: 'esbuild-plugin-vue',
  setup(build) {
    const stylesStore = new Map();

    build.onResolve({ filter: /\.vue\.[0-9]*\.css$/ }, ({ path }) => ({ path }));

    build.onLoad({ filter: /\.vue\.[0-9]*\.css$/ }, ({ path }) => {
      const contents = stylesStore.get(path);
      return contents ? { contents, loader: 'css' } : null;
    });

    build.onLoad({ filter: /\.vue$/, namespace: 'file' }, async ({ path }) => {
      const filename = basename(path);
      const source = await readFile(path, { encoding: 'utf8' });

      const { errors, descriptor } = parse(source, {
        filename,
        sourceMap: true,
      });
      if (errors.length) return { errors };

      const { script, scriptSetup, template, styles } = descriptor;
      const scripts = [script, scriptSetup].filter(Boolean);
      const hasScript = !!scripts.length;
      const loader = scripts.some(({ lang }) => lang === 'ts') ? 'ts' : 'js';
      const id = (hasScript || template) && `data-v-${hashsum(path)}`;
      let contents = '';

      if (hasScript) {
        const { content, map } = compileScript(descriptor, {
          id,
          inlineTemplate: true,
        });

        // the replace should be correctly handled by @vue/compiler-sfc not by me
        contents = withMap(content.replace('{ ,', '{'), map);
      } else if (template) {
        const { errors, code, map } = compileTemplate({
          id,
          filename,
          source: template.content,
          preprocessLang: template.lang,
          compilerOptions: { scopeId: id },
        });

        if (errors.length) return { errors };

        contents = withMap(`${code}\nexport default { render };`, map);
      }

      if (styles.length) {
        const results = await Promise.all(
          styles.map(async (stylePart, index) => {
            const stylePath = `${path}.${index}.css`;
            const { errors, code, map } = await compileStyleAsync({
              filename: path,
              source: stylePart.content,
              id,
              scoped: stylePart.scoped,
              modules: stylePart.module,
              preprocessLang: stylePart.lang,
            });

            if (errors.length) return { errors };

            stylesStore.set(stylePath, withMap(code, map, true));
            contents += `\nimport ${JSON.stringify(stylePath)};`;
          }),
        );

        const errors = results.reduce((res, { errors } = {}) => {
          if (errors) res = [...res, ...errors];
          return res;
        }, []);
        if (errors.length) return { errors };
      }

      return { contents, loader };
    });
  },
};

export default esbuildPluginVue;
