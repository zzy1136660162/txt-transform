import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    /**
     * Ignore the following files.
     * Please note that pluginQuasar.configs.recommended() already ignores
     * the "node_modules" folder for you (and all other Quasar project
     * relevant folders and files).
     *
     * ESLint requires "ignores" key to be the only one in this object
     */
    ignorePatterns: ['**/*'],
    // 如果你用的是老的 ignores 写法，也可以：
    ignores: ['**/*']
  },

  pluginQuasar.configs.recommended(),
  js.configs.recommended,

  /**
   * https://eslint.vuejs.org
   *
   * pluginVue.configs.base
   *   -> Settings and rules to enable correct ESLint parsing.
   * pluginVue.configs[ 'flat/essential']
   *   -> base, plus rules to prevent errors or unintended behavior.
   * pluginVue.configs["flat/strongly-recommended"]
   *   -> Above, plus rules to considerably improve code readability and/or dev experience.
   * pluginVue.configs["flat/recommended"]
   *   -> Above, plus rules to enforce subjective community defaults to ensure consistency.
   */
  pluginVue.configs[ 'flat/essential' ],

  {
    files: ['**/*.ts', '**/*.vue','src-electron/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',   // ← 关键一行
      'prefer-promise-reject-errors': 'off',
      'vue/no-unused-components':             'off',
      'vue/no-unused-vars':                   'off',

      // TypeScript/ESLint 相关
      '@typescript-eslint/no-unused-vars':    'off',
      '@typescript-eslint/no-floating-promises':'off',
      '@typescript-eslint/no-explicit-any':   'off',
      '@typescript-eslint/no-unnecessary-type-assertion':'off',
      '@typescript-eslint/no-unused-expressions':'off',

      // 取消所有“期待”错误
      'no-console':                           'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' }
      ],
    }
  },
  // https://github.com/vuejs/eslint-config-typescript
  vueTsConfigs.recommendedTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly' // BEX related
      }
    },

    // add your custom rules here
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'prefer-promise-reject-errors': 'off',
      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      // Vue 相关
      'vue/no-unused-components':             'off',
      'vue/no-unused-vars':                   'off',

      // TypeScript/ESLint 相关
      '@typescript-eslint/no-unused-vars':    'off',
      '@typescript-eslint/no-floating-promises':'off',
      '@typescript-eslint/no-explicit-any':   'off',
      '@typescript-eslint/no-unnecessary-type-assertion':'off',
      '@typescript-eslint/no-unused-expressions':'off',

      // 取消所有“期待”错误
      'no-console':                           'off',
    }
  },

  {
    files: [ 'src-pwa/custom-service-worker.ts' ],
    languageOptions: {
      globals: {
        ...globals.serviceworker
      }
    }
  },

  prettierSkipFormatting
)
