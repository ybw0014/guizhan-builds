module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended'
    ],
    plugins: [
    ],
    // add your custom rules here
    rules: {
        indent: ['error', 4],
        'vue/html-indent': 'off',
        'prefer-const': 'off',
        'vue/multi-word-component-names': 'off',
        'space-before-function-paren': ['error', 'never']
    },
    overrides: [
        {
            files: ['**/*.{ts,tsx}'],
            settings: {
                'import/parsers': {
                    '@typescript-eslint/parser': ['.ts', '.tsx']
                },
                'import/resolver': {
                    typescript: {
                        project: './tsconfig.json'
                    },
                    node: {
                        extensions: ['.ts', '.tsx']
                    }
                }
            },
            parser: '@typescript-eslint/parser',
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: './tsconfig.json'
            },
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking'
            ],
            rules: {
            }
        }
    ]
}
