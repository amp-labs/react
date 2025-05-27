// eslint.config.js
const js = require('@eslint/js');
const globals = require('globals');
const pluginReact = require('eslint-plugin-react');
const pluginReactHooks = require('eslint-plugin-react-hooks');
const pluginJsxA11y = require('eslint-plugin-jsx-a11y');
const pluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
const pluginReactRefresh = require('eslint-plugin-react-refresh');
const pluginTs = require('@typescript-eslint/eslint-plugin');
const parserTs = require('@typescript-eslint/parser');
const pluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        jsxImportSource: 'react',
      },
      globals: {
        ...globals.browser, // allows usage of window, document, etc.
        ...globals.es2021,
        React: true, // avoids "React is not defined" false positive
        node: true, // adds `process` and other Node.js globals
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      'simple-import-sort': pluginSimpleImportSort,
      'react-refresh': pluginReactRefresh,
      prettier: pluginPrettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': 'warn', // <- actually runs Prettier as a rule
      ...pluginTs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,


      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],

      // Your custom rules
      'simple-import-sort/imports': 'error',
      'react-refresh/only-export-components': 'warn',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'max-len': ['warn', { code: 125 }],
      '@typescript-eslint/no-explicit-any': 'warn', // temp: remove to enforce type safety
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      // disable these rules for now (eslint migration)
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // External packages
            ['^react', '^@?\\w'],

            // Internal aliases
            ['^(@|components)(/.*|$)'],

            // Side effect imports
            ['^\\u0000'],

            // Parent imports like ../
            ['^\\.\\.(?!/?$)'],

            // Same folder imports like ./
            ['^\\./'],

            // Other relative imports (fallback)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

            // Style imports
            ['^.+\\.?(css)$'],
          ],
        },
      ],
    },
  },
];

