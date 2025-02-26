import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import globals from 'globals';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/build',
      '**/public',
      '**/coverage',
      '**/node_modules',
      '.yarn/.cache',
      '**/.husky',
      '**/.nyc_output',
      '**/.yarn',
      '**/commitlint.config.ts',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
    "airbnb",
    "plugin:import/typescript", // this is needed because airbnb uses eslint-plugin-import
    "prettier",
    "plugin:cypress/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      'react-hooks': fixupPluginRules(reactHooks),
    },

    languageOptions: {
      globals: {
        cy: true,
        Cypress: true,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },

        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {

    "react/no-array-index-key": "off",
    "react/jsx-props-no-spreading": "off",
    "react/destructuring-assignment": "off",
    "react/require-default-props": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "import/no-import-module-exports": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": true
      }
    ],
    "import/prefer-default-export": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never",
        "js": "never",
        "tsx": "never"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ],
    "@typescript-eslint/no-var-requires": "off",
    "global-require": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-filename-extension": [
      "warn",
      {
        "extensions": [".tsx"]
      }
    ],
    "react/function-component-definition": [
      2,
      {
        "namedComponents": "arrow-function"
      }
    ],
    // eslint rule reports false error
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"]
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        {
          allowHigherOrderFunctions: true,
        },
      ],
    },
  },
  {
    files: ['src/**/*.js', 'src/**/*.tsx', 'src/**/*.ts'],

    rules: {
      'no-restricted-syntax': ['error'],
    },
  },
  {
    files: ['src/modules/appStateWorker/worker/appStateWorker.ts'],
    languageOptions: {
      globals: {
        ...globals.worker,
        self: true,
      },
    },
  },
];
