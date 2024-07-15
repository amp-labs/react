/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import dts from 'vite-plugin-dts';

import * as packageJson from './package.json';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dts({ rollupTypes: true }),
    // visualizer plugin only in development mode
    mode === 'development' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption],
  build: {
    outDir: './build',
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `amp-react.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies),
        'react/jsx-runtime'],
    },
  },
}));
