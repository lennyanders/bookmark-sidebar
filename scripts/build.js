import * as esbuild from 'esbuild';

import {
  emptyDist,
  copyPublicFiles,
  writeManifest,
  buildBackground,
  buildContent,
  buildNewtab,
  afterBuildContent,
} from './shared';

await emptyDist();

const esbuildOptions = {
  minify: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
};

await Promise.all([
  buildBackground(esbuild, esbuildOptions),
  buildContent(esbuild, esbuildOptions).then(afterBuildContent),
  buildNewtab(esbuild, esbuildOptions),
  copyPublicFiles(),
  writeManifest(),
]);
