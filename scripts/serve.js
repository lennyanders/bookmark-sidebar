import { normalize } from 'path';
import { startService } from 'esbuild';
import watch from 'node-watch';

import {
  emptyDist,
  copyPublicFiles,
  writeManifest,
  buildBackground,
  buildContent,
  buildNewtab,
  afterBuildContent,
} from './shared';

const [service] = await Promise.all([startService(), emptyDist()]);

const esbuildOptions = {
  sourcemap: 'inline',
  incremental: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
};

watch('dist', (event, name) => {
  if (event === 'update' && name === normalize('dist/content.css')) {
    afterBuildContent();
  }
});

const [
  { rebuild: rebuildBackground },
  { rebuild: rebuildContent },
  { rebuild: rebuildNewtab },
] = await Promise.all([
  buildBackground(service, esbuildOptions),
  buildContent(service, esbuildOptions),
  buildNewtab(service, esbuildOptions),
  copyPublicFiles(),
  writeManifest(),
]);

watch('src/background', { recursive: true }, rebuildBackground);
watch(['src/content', 'src/sidebar'], { recursive: true }, rebuildContent);
watch(['src/newtab', 'src/sidebar'], { recursive: true }, rebuildNewtab);
watch('public', { recursive: true }, copyPublicFiles);
watch('src/manifest.json', writeManifest);
