import * as esbuild from 'esbuild';

import {
  deleteDist,
  copyPublicFiles,
  writeManifest,
  buildBackground,
  buildContent,
  buildNewtab,
  afterBuildContent,
} from './shared';

await deleteDist();

const esbuildOptions = {
  minify: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
};

await Promise.all([
  buildBackground(esbuild, esbuildOptions),
  (async () => {
    await buildContent(esbuild, esbuildOptions);
    await afterBuildContent();
  })(),
  buildNewtab(esbuild, esbuildOptions),
  copyPublicFiles(),
  writeManifest(),
]);
