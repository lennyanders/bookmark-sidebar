import { rm, mkdir, writeFile } from 'fs/promises';
import { copyDir, createBuilder } from './utils';
import sass from './esbuild-plugin-sass';
import { version } from '../package.json';
import manifest from '../src/manifest.json';

export const emptyDist = async () => {
  await rm('dist', { force: true, recursive: true });
  await mkdir('dist');
};

export const copyPublicFiles = () => copyDir('public', 'dist');

export const writeManifest = () => {
  return writeFile('dist/manifest.json', JSON.stringify({ ...manifest, version }));
};

export const buildBackground = createBuilder({
  entryPoints: ['background/main.js'],
  outfile: 'dist/background.js',
  format: 'esm',
  bundle: true,
  logLevel: 'info',
  plugins: [sass],
});

export const buildContent = createBuilder({
  entryPoints: ['content/main.js'],
  outfile: 'dist/content.js',
  format: 'esm',
  bundle: true,
  logLevel: 'info',
});

export const buildNewtab = createBuilder({
  entryPoints: ['newtab/main.js'],
  outfile: 'dist/newtab.js',
  format: 'esm',
  bundle: true,
  logLevel: 'info',
});
