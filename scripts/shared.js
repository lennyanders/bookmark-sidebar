import { rm, mkdir, writeFile, readFile } from 'fs/promises';
import { copyDir, createBuilder } from './utils';
import vue from './esbuild-plugin-vue';
import sass from './esbuild-plugin-sass';
import { version } from '../package.json';
import manifest from '../src/manifest.json';

export const emptyDist = async () => {
  await rm('dist', { force: true, recursive: true });
  await mkdir('dist');
};

export const copyPublicFiles = () => copyDir('public', 'dist');

export const writeManifest = () => {
  return writeFile(
    'dist/manifest.json',
    JSON.stringify({ ...manifest, version }),
  );
};

export const buildBackground = createBuilder({
  entryPoints: ['src/background/main.js'],
  outfile: 'dist/background.js',
  format: 'esm',
  bundle: true,
});

export const buildContent = createBuilder({
  entryPoints: ['src/content/main.js'],
  outfile: 'dist/content.js',
  format: 'esm',
  bundle: true,
  plugins: [vue],
  define: {
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
  },
});

export const buildNewtab = createBuilder({
  entryPoints: ['src/newtab/main.js'],
  outfile: 'dist/newtab.js',
  format: 'esm',
  bundle: true,
  plugins: [vue, sass],
  define: {
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
  },
});

export const inlineContentCss = async () => {
  const css = await readFile('dist/content.css', 'utf8');
  const js = await readFile('dist/content.js', 'utf8');
  await writeFile(
    'dist/content.js',
    js.replace('window.styles', JSON.stringify(css)),
  );
  await rm('dist/content.css');
};
