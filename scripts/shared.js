import { rm, copyFile, readdir, mkdir, writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';
import * as esbuild from 'esbuild';
import vue from './esbuild-plugin-vue';
import sass from './esbuild-plugin-sass';
import { version } from '../package.json';
import manifest from '../src/manifest.json';

export const deleteDist = () => rm('dist', { force: true, recursive: true });

export const copyDir = async (entry, target) => {
  const dir = await readdir(entry, { withFileTypes: true });
  await Promise.all(
    dir.map(async (dirent) => {
      if (dirent.isDirectory()) {
        await copyDir(
          resolve(entry, dirent.name),
          resolve(target, dirent.name),
        );
      } else {
        await mkdir(target, { recursive: true });
        await copyFile(
          resolve(entry, dirent.name),
          resolve(target, dirent.name),
        );
      }
    }),
  );
};

export const copyPublicFiles = () => copyDir('public', 'dist');

export const writeManifest = async () => {
  await mkdir('dist');
  await writeFile(
    'dist/manifest.json',
    JSON.stringify({ ...manifest, version }),
  );
};

const deepAssign = (obj1, obj2) => {
  if (!obj1) return {};
  if (!obj2) return obj1;

  for (const key in obj2) {
    if (Object.prototype.toString.call(obj2[key]) === '[object Object]') {
      obj1[key] = deepAssign(obj1[key] || {}, obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
};

/**
 * @callback Builder
 * @param {esbuild|esbuild.Service} esbuildOrEsbuildService
 * @param {esbuild.BuildOptions} options
 * @returns {Promise<esbuild.BuildResult>}
 */

/**
 * @param {esbuild.BuildOptions} defaultOptions
 * @returns {Builder}
 */
const createBuilder = (defaultOptions) => (esbuildOrEsbuildService, options) =>
  esbuildOrEsbuildService.build(deepAssign(defaultOptions, options));

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
  plugins: [vue, sass],
  resolveExtensions: ['.js', '.vue'],
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
  resolveExtensions: ['.js', '.vue'],
  define: {
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
  },
});

export const afterBuildContent = async () => {
  const css = await readFile('dist/content.css', 'utf8');
  const js = await readFile('dist/content.js', 'utf8');
  await writeFile('dist/content.js', js.replace('styles', JSON.stringify(css)));
  await rm('dist/content.css');
};
