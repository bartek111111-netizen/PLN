import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier'

const vueRecommended = vuePlugin.configs['flat/recommended']

export default [
  {
    ignores: ['node_modules/', 'dist/', 'public/'],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: vuePlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      ...vueRecommended.reduce((acc, item) => {
        if (item.rules) {
          return { ...acc, ...item.rules }
        }
        return acc
      }, {}),
      'vue/multi-word-component-names': 'off',
      'vue/comment-directive': 'off',
      'vue/no-multi-spaces': 'warn',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': ['warn', { html: { void: 'always' } }],
      'no-console': 'warn',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.eslint.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'prettier/prettier': 'error',
    },
  },
]