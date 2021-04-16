import { rm, mkdir, writeFile } from 'fs/promises';
import { copyDir, createBuilder } from './utils.js';
import sass from './esbuild-plugin-sass/index.js';
import crxDictionary from './esbuild-plugin-crx-disctionary/index.js';
import pkg from '../package.json';
import manifest from '../src/manifest.json';

export const emptyDist = async () => {
  await rm('dist', { force: true, recursive: true });
  await mkdir('dist');
};

export const copyPublicFiles = () => copyDir('public', 'dist');

export const writeManifest = () => {
  return writeFile('dist/manifest.json', JSON.stringify({ ...manifest, version: pkg.version }));
};

const dictPlugin = crxDictionary();

export const buildBackground = createBuilder({
  entryPoints: ['background/main.js'],
  outfile: 'dist/background.js',
  format: 'esm',
  bundle: true,
  logLevel: 'info',
  plugins: [sass, dictPlugin],
  define: {
    'process.env.ESBUILD_BUILD': JSON.stringify('background'),
  },
});

export const buildContent = createBuilder({
  entryPoints: ['content/main.js'],
  outfile: 'dist/content.js',
  format: 'esm',
  bundle: true,
  logLevel: 'info',
  define: {
    'process.env.ESBUILD_BUILD': JSON.stringify('content'),
  },
});

export const buildNewtab = createBuilder({
  entryPoints: ['newtab/main.js'],
  outfile: 'dist/newtab.js',
  format: 'esm',
  bundle: true,
  logLevel: 'info',
  plugins: [dictPlugin],
});
