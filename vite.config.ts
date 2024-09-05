import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import dts from 'vite-plugin-dts';

import * as packageJson from './package.json';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@generated': path.resolve(__dirname, './generated-sources'),
      '@styled-system': path.resolve(__dirname, './styled-system'),
      src: path.resolve(__dirname, './src'),
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      context: path.resolve(__dirname, './src/context'),
      hooks: path.resolve(__dirname, './src/hooks'),
      services: path.resolve(__dirname, './src/services'),
    },
  },
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
