module.exports = {
    purge: [
        './components/**/*.{vue,js}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}'
    ],
    // mode: 'jit',
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            textColor: {
                inherit: 'inherit'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: [
        require('@tailwindcss/forms')
    ]
}
