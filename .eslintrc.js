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
        'vue/multi-word-component-names': 'off'
    }
}
