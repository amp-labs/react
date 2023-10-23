module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:react/jsx-runtime',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'simple-import-sort',
    'react-hooks'
  ],
  rules: {
    'no-console': ["error", { allow: ["warn", "error"] }],
    'import/no-unresolved': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-unescaped-entities': 0,
    'import/prefer-default-export': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn', //TODO: delete this once codebase is more stable.
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx',
      ],
      rules: {
        // override "simple-import-sort" config:
        // https://dev.to/julioxavierr/sorting-your-imports-with-eslint-3ped
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages `react` related packages come first.
              ['^react', '^@?\\w',
              ],
              // Internal packages.
              ['^(@|components)(/.*|$)',
              ],
              // Side effect imports.
              ['^\\u0000',
              ],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$',
              ],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$',
              ],
              // Style imports.
              ['^.+\\.?(css)$',
              ],
            ],
          },
        ],
      },
    },
  ],
};
