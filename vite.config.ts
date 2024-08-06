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
    // lib: {
    //   entry: './src/index.ts',
    //   formats: ['es', 'cjs'],
    //   fileName: (format) => `amp-react.${format}.js`,
    // },
    rollupOptions: {
      input: {
        lib: path.resolve(__dirname, './src/index.ts'),
        webComponent: path.resolve(__dirname, './src/webcomponents/index.tsx'),
      },
      output: [
        // Output for React library
        {
          dir: 'build/lib',
          format: 'es',
          entryFileNames: 'amp-react.es.js',
          chunkFileNames: '[name]-[hash].js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        {
          dir: 'build/lib',
          format: 'cjs',
          entryFileNames: 'amp-react.cjs.js',
          chunkFileNames: '[name]-[hash].js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        // Output for Web Component
        {
          dir: 'build/web-component',
          format: 'es',
          entryFileNames: 'my-web-component.js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      ],
      external: [...Object.keys(packageJson.peerDependencies),
        'react/jsx-runtime', 'react-dom/client'],
    },
  },
}));
