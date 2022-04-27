export default {
    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'Guizhan Builds',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,shrink-to-fit=no' },
            { hid: 'description', name: 'description', content: 'Guizhan Builds' },
            { hid: 'author', name: 'author', content: 'ybw0014' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://jslib.gzassets.cn/gh/hung1001/font-awesome-pro/css/all.min.css' },
            { rel: 'stylesheet', href: 'https://gzassets.cn/fonts/AlibabaPuHuiTi.css' }
        ],
        script: [
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/styles/builds.scss'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://github.com/fumeapp/nuxt-storm
        'nuxt-storm',
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/tailwindcss
        '@nuxtjs/tailwindcss'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://www.npmjs.com/package/nuxt-lazy-load
        ['nuxt-lazy-load', {
            directiveOnly: true,
            defaultImage: '/images/default_badge.svg'
        }],
        // https://i18n.nuxtjs.org/
        ['@nuxtjs/i18n', {
            locales: [
                {
                    code: 'en',
                    file: 'en-US.js'
                },
                {
                    code: 'zh',
                    file: 'zh-CN.js'
                }
            ],
            lazy: true,
            langDir: 'lang/',
            defaultLocale: 'en',
            strategy: 'no_prefix',
            detectBrowserLanguage: {
                useCookie: true,
                alwaysRedirect: true
            }
        }]
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
    },

    tailwindcss: {
        cssPath: '@/assets/styles/builds.css'
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        babel: {
            compact: true
        }
    },

    generate: {
        fallback: true
    },

    watchers: {
        webpack: {
            ignored: /(node_modules)|(.git)|(.eslintcache)|(.nuxt)/
        }
    }
}
