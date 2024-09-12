// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from '@pandacss/dev'; // dev dependency

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // panda opinionated presets
  presets: ['@pandacss/preset-panda'],

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },
  jsxFramework: 'react',

  // The output directory for your css system
  outdir: 'styled-system',
  prefix: 'amp-',
});
